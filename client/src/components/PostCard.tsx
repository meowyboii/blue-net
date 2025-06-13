"use client";

import { useCallback, useEffect, useState } from "react";
import { Post } from "@/types/post";
import PostActions from "./PostActions";
import ReactionsCount from "./ReactionsCount";
import { Reaction, ReactionCount } from "@/types/reaction";
import { getReactions } from "@/lib/reactions/getReactions";
import { useAuth } from "@/context/AuthContext";
import { getPost } from "@/lib/posts/getPost";
import { ReactionType } from "@/types/enums";
import Avatar from "./ui/avatar";
import AudioPlayer from "./AudioPlayer";

interface PostCardProps {
  post: Post | null;
}

export default function PostCard({ post }: PostCardProps) {
  const [topReactions, setTopReactions] = useState<ReactionCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(
    null
  );
  const { user } = useAuth();

  const fetchReactions = useCallback(async () => {
    if (!post?.id) return;

    try {
      const reactionsData = await getReactions(post?.id);

      const total = reactionsData.reduce(
        (acc: number, reaction: ReactionCount) => acc + reaction.count,
        0
      );
      setTotalCount(total);

      const sortedReactions = [...reactionsData]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setTopReactions(sortedReactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }, [post?.id]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  // Check if the user already reacted based on initial data
  const checkInitialReaction = useCallback(async () => {
    try {
      if (!post?.id || !user?.id) return;
      const postData = await getPost(post.id);
      if (postData.reactions && user?.id) {
        const userReaction = postData.reactions.find(
          (reaction: Reaction) => reaction.userId === user.id
        );
        setSelectedReaction(userReaction?.type ?? null);
      } else {
        setSelectedReaction(null);
      }
    } catch (error) {
      console.error("Error fetching post for initial reaction check:", error);
    }
  }, [post, setSelectedReaction, user?.id]);

  if (!post) {
    return null; // loading state
  }

  return (
    <div className="space-y-6 bg-card p-8 rounded-xl relative">
      <div className="flex items-center space-x-4">
        <Avatar src={post.author.avatarUrl} alt="profile picture" size={50} />
        <div>
          <h3 className="text-lg font-semibold">{post.author.displayName}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(post.updatedAt).toLocaleDateString()}{" "}
          </p>
        </div>
      </div>
      {post.audioUrl && <AudioPlayer audioUrl={post.audioUrl} />}

      <p className="text-lg whitespace-pre-wrap">{post.content}</p>

      <div>
        <ReactionsCount topReactions={topReactions} totalCount={totalCount} />
        <PostActions
          post={post}
          topReactions={topReactions}
          totalCount={totalCount}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          checkInitialReaction={checkInitialReaction}
          fetchReactions={fetchReactions}
        />
      </div>
    </div>
  );
}
