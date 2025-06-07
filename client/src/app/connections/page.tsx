// components/UserTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { getSuggestions } from "@/lib/users/getSuggestions";
import { getFollowers } from "@/lib/follows/getFollowers";
import { getFollowing } from "@/lib/follows/getFollowing";
import { followUser } from "@/lib/follows/followUser";
import { FollowWithFollower, FollowWithFollowing } from "@/types/follow";
import Avatar from "@/components/ui/avatar";

export default function UserTabs() {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [followers, setFollowers] = useState<FollowWithFollower[]>([]);
  const [following, setFollowing] = useState<FollowWithFollowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, f, g] = await Promise.all([
          getSuggestions(),
          getFollowers(),
          getFollowing(),
        ]);
        setSuggestions(s);
        setFollowers(f);
        setFollowing(g);
      } catch (err) {
        console.error("Failed to load user connections:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId: string) => {
    await followUser(userId);
    setSuggestions((prev) => prev.filter((user) => user.id !== userId));
    const updatedFollowing = await getFollowing();
    setFollowing(updatedFollowing);
  };

  const followingIds = new Set(following.map((f) => f.following.id));

  const renderUser = (user: UserProfile, isFollowButton?: boolean) => (
    <div
      key={user.id}
      className="flex items-center justify-between py-3 border-b border-muted"
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={user.avatarUrl}
          alt={`${user.firstName}'s avatar`}
          size={50}
        />
        <div>
          <p className="text-sm font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {isFollowButton ? (
        <button
          onClick={() => handleFollow(user.id)}
          className="px-3 py-1 text-sm rounded-full border hover:bg-primary/10 hover:text-primary hover:border-primary transition cursor-pointer"
        >
          Follow
        </button>
      ) : (
        <button className="px-3 py-1 text-sm rounded-full border hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition cursor-pointer">
          Unfollow
        </button>
      )}
    </div>
  );

  if (loading)
    return (
      <Loader2 size={40} className="animate-spin mx-auto my-10 text-primary" />
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-xl w-full mx-auto mt-6 p-4">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent ">
          <TabsTrigger
            value="suggestions"
            className="cursor-pointer hover:bg-foreground/10 "
          >
            Who to follow
          </TabsTrigger>
          <TabsTrigger
            value="followers"
            className="cursor-pointer hover:bg-foreground/10"
          >
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="cursor-pointer hover:bg-foreground/10"
          >
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions">
          <h3 className="text-sm text-muted-foreground mb-2">
            Suggestions for you
          </h3>
          {loading ? (
            <Loader2 className="animate-spin mx-auto my-4 text-primary" />
          ) : (
            suggestions.map((user) => renderUser(user, true))
          )}
        </TabsContent>

        <TabsContent value="followers">
          <h3 className="text-sm text-muted-foreground mb-2">Your followers</h3>
          {loading ? (
            <Loader2 className="animate-spin mx-auto my-4 text-primary" />
          ) : (
            followers.map((follow) =>
              // Check if the follower is already being followed
              renderUser(follow.follower, !followingIds.has(follow.follower.id))
            )
          )}
        </TabsContent>

        <TabsContent value="following">
          <h3 className="text-sm text-muted-foreground mb-2">
            You are following
          </h3>
          {loading ? (
            <Loader2 className="animate-spin mx-auto my-4 text-primary" />
          ) : (
            following.map((follow) => renderUser(follow.following))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
