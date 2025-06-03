import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow as FollowModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from 'src/@types/user-payload';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('follow')
@UseGuards(AuthGuard('jwt'))
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':followingId')
  async followUser(
    @Param('followingId') followingId: string,
    @CurrentUser() user: UserPayload,
  ): Promise<FollowModel> {
    return this.followService.createFollow({
      followerId: user.id,
      followingId,
    });
  }
  @Get('followers')
  getFollowers(@CurrentUser() user: UserPayload): Promise<FollowModel[]> {
    return this.followService.getFollowers({ followingId: user.id });
  }

  @Get('following')
  getFollowing(@CurrentUser() user: UserPayload): Promise<FollowModel[]> {
    return this.followService.getFollowing({ followerId: user.id });
  }
}
