import { User } from '@prisma/client';
export interface UserWithCounts extends User {
  followersCount: number;
  followingCount: number;
}
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string;
  createdAt: Date;
}

export interface UserProfileWithCounts extends UserProfile {
  followersCount: number;
  followingCount: number;
}
