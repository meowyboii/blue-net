export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
}
