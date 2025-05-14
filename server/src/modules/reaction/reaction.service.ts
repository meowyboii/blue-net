import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Reaction, Prisma, ReactionType } from '@prisma/client';

@Injectable()
export class ReactionService {
  constructor(private prisma: PrismaService) {}

  async reaction(
    reactionWhereUniqueInput: Prisma.ReactionWhereUniqueInput,
  ): Promise<Reaction | null> {
    return this.prisma.reaction.findUnique({
      where: reactionWhereUniqueInput,
    });
  }

  async reactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReactionWhereUniqueInput;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput;
  }): Promise<Reaction[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.reaction.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createReaction(data: {
    userId: string;
    postId: string;
    type: ReactionType;
  }): Promise<Reaction> {
    const { userId, postId, type } = data;
    return await this.prisma.reaction.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      create: {
        type,
        user: {
          connect: { id: userId },
        },
        post: {
          connect: { id: postId },
        },
      },
      update: {
        type,
      },
    });
  }
  async updateReaction(params: {
    where: Prisma.ReactionWhereUniqueInput;
    data: Prisma.ReactionUpdateInput;
  }): Promise<Reaction> {
    const { where, data } = params;
    return this.prisma.reaction.update({
      data,
      where,
    });
  }

  async deleteReaction(
    where: Prisma.ReactionWhereUniqueInput,
  ): Promise<Reaction> {
    return this.prisma.reaction.delete({
      where,
    });
  }
}
