"use client";

import { Post } from "@/types/post";
import { useState } from "react";
import { ThumbsUpIcon } from "lucide-react";

interface PostCardProps {
  post: Post | null;
}

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function PostCard({ post }: PostCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    setIsHovering(false);
  };

  return (
    post && (
      <div className="space-y-6 bg-card p-8 rounded-xl relative">
        <div className="flex items-center space-x-4">
          <span className="w-12 h-12 rounded-full bg-foreground" />
          <div>
            <h3 className="text-lg font-semibold">{post.author.firstName}</h3>
            <p className="text-sm text-muted-foreground">{post.updatedAt}</p>
          </div>
        </div>
        <p className="text-lg">{post.content}</p>
        <div className="flex relative">
          <button
            className="cursor-pointer text-xl hover:text-foreground/70 transition-all"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {selectedReaction ? selectedReaction : <ThumbsUpIcon size={28} />}
          </button>
          {isHovering && (
            <div
              className="absolute bottom-[-5] mb-2 right-50 bg-transparent p-10 rounded-lg flex gap-2 z-50 cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex bg-card rounded-lg shadow-md">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-3xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
