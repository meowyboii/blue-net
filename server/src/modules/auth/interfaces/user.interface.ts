import { User } from '@prisma/client';
export interface UserWithCounts extends User {
  followersCount: number;
  followingCount: number;
}
