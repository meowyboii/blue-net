"use client";

import { Post } from "@/types/post";
import { ReactionCount } from "@/types/reaction";
import { ReactionType } from "@/types/enums";
import { useState, useRef, useEffect, useCallback } from "react";
import { ThumbsUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createReaction } from "@/lib/reactions/createReaction";
import { getReactions } from "@/lib/reactions/getReactions";
import { useAuth } from "@/context/AuthContext";

// Mapping ReactionType to their corresponding emojis
const reactionsMap: Record<ReactionType, string> = {
  [ReactionType.LIKE]: "👍",
  [ReactionType.LOVE]: "❤️",
  [ReactionType.HAHA]: "😂",
  [ReactionType.WOW]: "😮",
  [ReactionType.SAD]: "😢",
  [ReactionType.ANGRY]: "😡",
};

interface PostCardProps {
  post: Post | null;
}

export default function PostCard({ post }: PostCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [topReactions, setTopReactions] = useState<ReactionCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Fetch Reactions Logic
  const fetchReactions = useCallback(async () => {
    if (!post?.id) return;

    try {
      const reactions = await getReactions(post.id);

      // Calculate total reactions count
      const total = reactions.reduce(
        (acc: number, reaction: ReactionCount) => acc + reaction.count,
        0
      );
      setTotalCount(total);

      // Sort by Count (Descending Order) and get the top 3
      const sortedReactions = [...reactions]
        .sort((a: ReactionCount, b: ReactionCount) => b.count - a.count)
        .slice(0, 3);

      setTopReactions(sortedReactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }, [post?.id]);

  // Call it on component mount & when selectedReaction changes
  useEffect(() => {
    fetchReactions();
  }, [fetchReactions, selectedReaction]);

  // Check if the user already reacted
  useEffect(() => {
    if (post?.reactions && user?.id) {
      const reactionType = post.reactions.find(
        (reaction) => reaction.userId === user.id
      )?.type;

      if (reactionType) {
        setSelectedReaction(reactionType);
      }
    }
  }, [post?.reactions, user?.id]);

  // Handle Reaction Logic
  const handleReaction = async (reaction: string) => {
    setSelectedReaction(reaction);
    setIsHovering(false);
    clearTimeout(hideTimeoutRef.current!);

    if (!post?.id) {
      console.error("Post ID is undefined");
      return;
    }
    try {
      await createReaction({
        postId: post.id,
        type: reaction as ReactionType,
      });

      // Fetch the updated reactions
      await fetchReactions();
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

        {/* Display Top Reactions and Total Count */}
        <div className="flex items-center space-x-1 mb-2">
          {topReactions.map((reaction) => (
            <div
              key={reaction.type}
              className="flex items-center gap-1 py-1 text-xl"
            >
              <span>{reactionsMap[reaction.type as ReactionType]}</span>
            </div>
          ))}
          {totalCount > 0 && (
            <span className="text-foreground/70">
              {totalCount} reaction{totalCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex relative">
          <button
            className="cursor-pointer text-xl hover:text-foreground/70 transition-all"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {selectedReaction ? (
              <AnimatePresence>
                <motion.span
                  key={selectedReaction}
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
