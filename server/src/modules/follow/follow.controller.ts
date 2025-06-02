import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow as FollowModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('follow')
@UseGuards(AuthGuard('jwt'))
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':followingId')
  async followUser(
    @Param('followingId') followingId: string,
    @Req() req: Request,
  ): Promise<FollowModel> {
    const user = req.user as { id: string };
    return this.followService.createFollow({
      followerId: user.id,
      followingId,
    });
  }
}
