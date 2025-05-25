"use client";

import { useCallback, useEffect, useState } from "react";
import { Post } from "@/types/post";
import PostActions from "./PostActions";
import ReactionsCount from "./ReactionsCount";
import { ReactionCount } from "@/types/reaction";
import { getReactions } from "@/lib/reactions/getReactions";

interface PostCardProps {
  post: Post | null;
}

export default function PostCard({ post }: PostCardProps) {
  const [topReactions, setTopReactions] = useState<ReactionCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  if (!post) {
    return null; // loading state
  }

  return (
    <div className="space-y-6 bg-card p-8 rounded-xl relative">
      <div className="flex items-center space-x-4">
        {/* Placeholder for author avatar, replace with actual image if available */}
        <span className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
          {post.author.firstName?.charAt(0)}
          {post.author.lastName?.charAt(0)}
        </span>
        <div>
          <h3 className="text-lg font-semibold">
            {post.author.firstName} {post.author.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(post.updatedAt).toLocaleDateString()}{" "}
          </p>
        </div>
      </div>
      <p className="text-lg whitespace-pre-wrap">{post.content}</p>

      <div>
        <ReactionsCount topReactions={topReactions} totalCount={totalCount} />
        <PostActions
          post={post}
          topReactions={topReactions}
          totalCount={totalCount}
          fetchReactions={fetchReactions}
        />
      </div>
    </div>
  );
}
