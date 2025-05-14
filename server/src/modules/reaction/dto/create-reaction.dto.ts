import { IsEnum, IsUUID } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;
}
