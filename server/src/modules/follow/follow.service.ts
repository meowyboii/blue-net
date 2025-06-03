import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Follow, Prisma } from '@prisma/client';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async getFollowers(
    followWhereUniqueInput: Prisma.FollowWhereInput,
  ): Promise<Follow[]> {
    return this.prisma.follow.findMany({
      where: followWhereUniqueInput,
      include: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getFollowing(
    followWhereUniqueInput: Prisma.FollowWhereInput,
  ): Promise<Follow[]> {
    return this.prisma.follow.findMany({
      where: followWhereUniqueInput,
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async createFollow(data: Prisma.FollowUncheckedCreateInput): Promise<Follow> {
    return this.prisma.follow.create({
      data,
    });
  }

  async updateFollow(params: {
    where: Prisma.FollowWhereUniqueInput;
    data: Prisma.FollowUpdateInput;
  }): Promise<Follow> {
    const { where, data } = params;
    return this.prisma.follow.update({
      data,
      where,
    });
  }

  async deleteFollow(where: Prisma.FollowWhereUniqueInput): Promise<Follow> {
    return this.prisma.follow.delete({
      where,
    });
  }
}
