export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  avatarUrl: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
}
