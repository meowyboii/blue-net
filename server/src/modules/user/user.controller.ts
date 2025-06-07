import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';
import { UpdateUserDto } from './dto/update-user.dto';

import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as multer from 'multer';
import { Express } from 'express';
import { UserProfile } from '../auth/interfaces/user.interface';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('suggested')
  async getSuggestedUsers(@CurrentUser() user: UserPayload) {
    return await this.userService.getUsersNotFollowedBy(user.id);
  }
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('avatar', { storage: multer.memoryStorage() }),
  )
  async updateUserProfile(
    @CurrentUser() user: UserPayload,
    @Body() userProfileData: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserProfile> {
    const avatarUrl = file
      ? await this.userService.uploadAvatar(file, user.id)
      : undefined;
    console.log(avatarUrl);
    const updatedUser = await this.userService.updateUser({
      where: { id: user.id },
      data: {
        displayName: userProfileData.displayName,
        bio: userProfileData.bio,
        ...(avatarUrl && { avatarUrl }), // Only include avatarUrl if it exists
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
