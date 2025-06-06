import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserWithCounts } from '../auth/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithCounts | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
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

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
