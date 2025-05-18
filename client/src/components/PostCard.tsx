// src/components/PostCard.tsx (or your path)
"use client";

import { Reaction } from "@/types/reaction";
import { Post } from "@/types/post";
import Reactions from "./Reactions"; // Adjust path to your new Reactions component

interface PostCardProps {
  post: Post | null;
}

export default function PostCard({ post }: PostCardProps) {
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

      <div className="mt-4 pt-4 border-t border-border">
        <Reactions
          postId={post.id}
          initialUserReactions={post.reactions as Reaction[]}
        />
      </div>
    </div>
  );
}
