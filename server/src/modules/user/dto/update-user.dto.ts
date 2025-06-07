import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1, { message: 'Display name is required' })
  @MaxLength(20, { message: 'Display name must not exceed 20 characters' })
  displayName: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Bio must not exceed 160 characters' })
  bio?: string;
}
