import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
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
    const user = req.user as { id: string };
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
