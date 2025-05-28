import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { Comment as CommentModel } from '@prisma/client';
import { Request } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('post/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  async createComment(
    @Param('postId') postId: string,
    @Body() commentData: CreateCommentDto,
    @Req() req: Request,
  ): Promise<CommentModel> {
    const user = req.user as { id: string };
    return this.commentService.createComment({
      ...commentData,
      postId, // from URL param
      authorId: user.id, // from authenticated user
    });
  }
}
