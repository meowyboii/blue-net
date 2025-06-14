import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('post')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('audio', { storage: multer.memoryStorage() }),
  )
  async createPost(
    @Body() postData: CreatePostDto,
    @CurrentUser() user: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PostModel> {
    const audioUrl = file
      ? await this.postService.uploadAudio(file, user.id)
      : undefined;
    return this.postService.createPost({
      ...postData,
      audioUrl,
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
      skip: skip !== undefined ? Number(skip) : undefined,
      take: take !== undefined ? Number(take) : undefined,
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
      skip: skip !== undefined ? Number(skip) : undefined,
      take: take !== undefined ? Number(take) : undefined,
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
