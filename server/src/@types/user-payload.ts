export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
}
