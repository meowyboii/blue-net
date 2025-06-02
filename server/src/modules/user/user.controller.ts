import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('suggested')
  async getSuggestedUsers(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.userService.getUsersNotFollowedBy(user.id);
  }
}
