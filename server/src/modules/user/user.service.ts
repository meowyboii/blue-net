import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { User, Prisma } from '@prisma/client';
import { UserWithCounts } from '../auth/interfaces/user.interface';
import { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ): Promise<UserWithCounts | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select,
    });
    if (!user) return null;
    const followersCount = await this.prisma.follow.count({
      where: { followingId: user?.id },
    });

    const followingCount = await this.prisma.follow.count({
      where: { followerId: user?.id },
    });
    return { ...user, followersCount, followingCount };
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getUsersNotFollowedBy(currentUserId: string) {
    const followedIds = await this.prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followedIdList = followedIds.map((f) => f.followingId);

    return this.prisma.user.findMany({
      where: {
        id: {
          notIn: [currentUserId, ...followedIdList], // Exclude self and followed users
        },
      },
      take: 10, // Limit the number of users returned
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
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async uploadAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string | undefined> {
    const supabase = this.supabase.getClient();
    try {
      const { error } = await supabase.storage
        .from('blue-net')
        .upload(`avatars/${userId}`, file.buffer, {
          contentType: file.mimetype,
          upsert: true, // allows overwriting
        });

      if (error) {
        throw new InternalServerErrorException('Failed to upload file', error);
      }

      const { data: publicData } = supabase.storage
        .from('blue-net')
        .getPublicUrl(`avatars/${userId}`);
      this.logger.log(`Avatar uploaded successfully: ${publicData.publicUrl}`);
      // Append a cache-busting query parameter to prevent the use of previous image in frontend
      return `${publicData.publicUrl}?t=${Date.now()}`;
    } catch (error) {
      this.logger.error('Avatar upload failed', error);
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    select: Prisma.UserSelect;
  }): Promise<User> {
    const { where, data, select } = params;
    return this.prisma.user.update({
      data,
      where,
      select,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
