export interface FollowWithFollower {
  id: string;
  followerId: string;
  followingId: string;
  follower: UserProfile;
}

export interface FollowWithFollowing {
  id: string;
  followerId: string;
  followingId: string;
  following: UserProfile;
}
