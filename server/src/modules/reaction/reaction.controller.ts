import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { Reaction as ReactionModel } from '@prisma/client';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createReaction(
    @Body() reactionData: CreateReactionDto,
    @Req() req: Request,
  ): Promise<ReactionModel> {
    const user = req.user as { userId: string };
    return this.reactionService.createReaction({
      ...reactionData,
      userId: user.userId,
    });
  }
}
