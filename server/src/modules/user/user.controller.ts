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
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';
import { UpdateUserDto } from './dto/update-user.dto';

import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as multer from 'multer';
import { Express } from 'express';
import {
  UserProfile,
  UserProfileWithCounts,
} from '../auth/interfaces/user.interface';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('suggested')
  async getSuggestedUsers(@CurrentUser() user: UserPayload) {
    return await this.userService.getUsersNotFollowedBy(user.id);
  }

  @Get('profile')
  async getUserProfile(
    @CurrentUser() user: UserPayload,
  ): Promise<UserProfileWithCounts | null> {
    return await this.userService.user(
      { id: user.id },
      {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    );
  }

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('avatar', { storage: multer.memoryStorage() }),
  )
  async updateUserProfile(
    @CurrentUser() user: UserPayload,
    @Body() userProfileData: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserProfile | null> {
    const avatarUrl = file
      ? await this.userService.uploadAvatar(file, user.id)
      : undefined;
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
