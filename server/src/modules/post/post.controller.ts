import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPost(
    @Body() postData: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostModel> {
    const user = req.user as { userId: string };
    return this.postService.createPost({
      ...postData,
      authorId: user.userId,
    });
  }
}
