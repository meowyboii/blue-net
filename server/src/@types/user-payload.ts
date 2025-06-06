export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
}
