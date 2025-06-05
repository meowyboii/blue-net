import { Controller, UseGuards, Get, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserModel } from '@prisma/client';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('suggested')
  async getSuggestedUsers(@CurrentUser() user: UserPayload) {
    return await this.userService.getUsersNotFollowedBy(user.id);
  }
  @Patch('profile')
  async updateUserProfile(
    @CurrentUser() user: UserPayload,
    @Body() userProfileData: UpdateUserDto,
  ): Promise<UserModel> {
    const updatedUser = await this.userService.updateUser({
      where: { id: user.id },
      data: userProfileData,
    });
    return updatedUser;
  }
}
