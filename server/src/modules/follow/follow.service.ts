import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Follow, Prisma } from '@prisma/client';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async follow(
    followWhereUniqueInput: Prisma.FollowWhereUniqueInput,
  ): Promise<Follow | null> {
    return this.prisma.follow.findUnique({
      where: followWhereUniqueInput,
    });
  }

  async follows(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FollowWhereUniqueInput;
    where?: Prisma.FollowWhereInput;
    orderBy?: Prisma.FollowOrderByWithRelationInput;
  }): Promise<Follow[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.follow.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
