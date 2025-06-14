import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { Reaction as ReactionModel } from '@prisma/client';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createReaction(
    @Body() reactionData: CreateReactionDto,
    @CurrentUser() user: UserPayload,
  ): Promise<ReactionModel> {
    return this.reactionService.createReaction({
      ...reactionData,
      userId: user.id,
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('counts/:postId')
  async getReactionCounts(@Param('postId') postId: string) {
    return this.reactionService.getReactionCounts(postId);
  }
}
