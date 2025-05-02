"use client";

import { Post } from "@/types/post";
import { useState, useRef } from "react";
import { ThumbsUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PostCardProps {
  post: Post | null;
}

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function PostCard({ post }: PostCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    setIsHovering(false);
    clearTimeout(hideTimeoutRef.current!);
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
                  {selectedReaction}
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
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
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
