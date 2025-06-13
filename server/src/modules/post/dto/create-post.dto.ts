import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: 'Display name is required' })
  @MaxLength(500, { message: 'Display name must not exceed 500 characters' })
  content: string;
}
