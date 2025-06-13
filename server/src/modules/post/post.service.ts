import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  private readonly logger = new Logger(PostService.name);

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });
  }

  async getUserPosts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });
  }

  async createPost(data: {
    authorId: string;
    content: string;
    audioUrl?: string;
  }): Promise<Post> {
    const { authorId, content, audioUrl } = data;

    return this.prisma.post.create({
      data: {
        content,
        audioUrl,
        ...(audioUrl && { audioUrl }), // Only include audioUrl if it exists
        author: {
          connect: { id: authorId },
        },
      },
    });
  }
  async uploadAudio(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string | undefined> {
    const supabase = this.supabase.getClient();
    const timestamp = Date.now();
    const extension = file.originalname.split('.').pop();
    try {
      const { error } = await supabase.storage
        .from('blue-net')
        .upload(
          `posts/${userId}/audio/${timestamp}.${extension}`,
          file.buffer,
          {
            contentType: file.mimetype,
          },
        );

      if (error) {
        throw new InternalServerErrorException('Failed to upload file', error);
      }

      const { data: publicData } = supabase.storage
        .from('blue-net')
        .getPublicUrl(`posts/${userId}/audio/${timestamp}.${extension}`);
      if (!publicData) {
        throw new InternalServerErrorException('Failed to get public URL');
      }
      this.logger.log(`Audio uploaded successfully: ${publicData.publicUrl}`);
      return publicData.publicUrl;
    } catch (error) {
      this.logger.error('Audio upload failed', error);
    }
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
