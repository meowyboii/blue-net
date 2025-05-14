"use client";

import { Post } from "@/types/post";
import { ReactionType } from "@/types/enums";
import { useState, useRef } from "react";
import { ThumbsUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createReaction } from "@/lib/reactions/createReaction";

interface PostCardProps {
  post: Post | null;
}

// Mapping ReactionType to their corresponding emojis
const reactionsMap: Record<ReactionType, string> = {
  [ReactionType.LIKE]: "👍",
  [ReactionType.LOVE]: "❤️",
  [ReactionType.HAHA]: "😂",
  [ReactionType.WOW]: "😮",
  [ReactionType.SAD]: "😢",
  [ReactionType.ANGRY]: "😡",
};

export default function PostCard({ post }: PostCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleReaction = async (reaction: string) => {
    setSelectedReaction(reaction);
    setIsHovering(false);
    clearTimeout(hideTimeoutRef.current!);

    if (!post?.id) {
      console.error("Post ID is undefined");
      return;
    }
    try {
      const reactionData = await createReaction({
        postId: post?.id,
        type: reaction as ReactionType,
      });

      console.log("Reaction created:", reactionData);
    } catch (error) {
      console.error("Error creating reaction:", error);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeoutRef.current!);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 500);
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {selectedReaction ? (
              <AnimatePresence>
                <motion.span
                  key={selectedReaction} // this triggers remount on change
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1.4, 1], opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="inline-block"
                >
                  {reactionsMap[selectedReaction as ReactionType]}
                </motion.span>
              </AnimatePresence>
            ) : (
              <ThumbsUpIcon size={28} />
            )}
          </button>

          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex p-1 absolute bottom-6 mb-2 right-[20vw] z-50 cursor-pointer bg-card rounded-lg shadow-md"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {Object.entries(reactionsMap).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type as ReactionType)}
                    className="text-3xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  );
}
