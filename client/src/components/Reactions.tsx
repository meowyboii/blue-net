// src/components/Reactions.tsx
"use client";

import { ReactionCount } from "@/types/reaction";
import { ReactionType } from "@/types/enums";
import { Reaction } from "@/types/reaction";
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

interface ReactionsProps {
  postId: string;
  initialUserReactions?: Reaction[]; // To check for existing user reaction
}

export default function Reactions({
  postId,
  initialUserReactions,
}: ReactionsProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [topReactions, setTopReactions] = useState<ReactionCount[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Fetch Reactions Logic
  const fetchReactions = useCallback(async () => {
    if (!postId) return;

    try {
      const reactionsData = await getReactions(postId);

      // Calculate total reactions count
      const total = reactionsData.reduce(
        (acc: number, reaction: ReactionCount) => acc + reaction.count,
        0
      );
      setTotalCount(total);

      // Sort by Count (Descending Order) and get the top 3
      const sortedReactions = [...reactionsData]
        .sort((a: ReactionCount, b: ReactionCount) => b.count - a.count)
        .slice(0, 3);

      setTopReactions(sortedReactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }, [postId]);

  // Call it on component mount & when selectedReaction changes (to reflect potential new counts)
  useEffect(() => {
    fetchReactions();
  }, [fetchReactions, selectedReaction]); // selectedReaction change will trigger re-fetch of counts

  // Check if the user already reacted based on initial data
  useEffect(() => {
    if (initialUserReactions && user?.id) {
      const userReaction = initialUserReactions.find(
        (reaction) => reaction.userId === user.id
      );
      if (userReaction) {
        setSelectedReaction(userReaction.type);
      } else {
        setSelectedReaction(null); // Explicitly set to null if no reaction found
      }
    } else {
      setSelectedReaction(null); // Reset if user or initial reactions change
    }
  }, [initialUserReactions, user?.id]);

  // Handle Reaction Logic
  const handleReaction = async (reactionType: ReactionType) => {
    // Optimistically update selected reaction
    const previousReaction = selectedReaction;
    setSelectedReaction(reactionType);
    setIsHovering(false);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (!postId) {
      console.error("Post ID is undefined for reaction");
      setSelectedReaction(previousReaction); // Revert optimistic update
      return;
    }
    try {
      await createReaction({
        postId: postId,
        type: reactionType,
      });

      // Fetch the updated reactions to get new counts and potentially new top reactions
      await fetchReactions();
    } catch (error) {
      console.error("Error creating reaction:", error);
      setSelectedReaction(previousReaction); // Revert optimistic update on error
    }
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 500);
  };

  return (
    <>
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
          <span className="text-sm text-foreground/70">
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
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedReaction}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1.2, 1], opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-block"
              >
                {reactionsMap[selectedReaction as ReactionType]}
              </motion.span>
            </AnimatePresence>
          ) : (
            <ThumbsUpIcon size={24} />
          )}
        </button>

        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex p-1 absolute bottom-8 left-0 z-50 cursor-pointer bg-card rounded-lg shadow-md ring-1 ring-border" // Adjust positioning & styling
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {Object.entries(reactionsMap).map(([type, emoji]) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type as ReactionType)}
                  className="text-3xl p-1 hover:scale-125 transition-transform cursor-pointer"
                  aria-label={`React with ${type.toLowerCase()}`}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
