import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';

@Controller('post')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  async createPost(
    @Body() postData: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostModel> {
    const user = req.user as { id: string };
    return this.postService.createPost({
      ...postData,
      authorId: user.id,
    });
  }

  @Get()
  async getPosts(
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<PostModel[]> {
    const posts = await this.postService.posts({
      orderBy: { createdAt: 'desc' },
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
    return posts;
  }

  @Get('me')
  async getUserPosts(
    @CurrentUser() user: UserPayload,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<PostModel[]> {
    const posts = await this.postService.posts({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
    return posts;
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostModel | null> {
    const post = await this.postService.post({ id });

    if (!post) {
      throw new NotFoundException(`Post with id "${id}" not found`);
    }

    return post;
  }
}
