// src/components/Reactions.tsx
"use client";

import { ReactionType } from "@/types/enums";
import { useState, useRef, useEffect } from "react";
import { ThumbsUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createReaction } from "@/lib/reactions/createReaction";

import { useAuth } from "@/context/AuthContext";
import { reactionsMap } from "@/constants/reactions";

interface ReactionsProps {
  postId: string;
  selectedReaction: ReactionType | null;
  setSelectedReaction: (reaction: ReactionType | null) => void;
  checkInitialReaction: () => Promise<void>;
  fetchReactions: () => Promise<void>;
}

export default function ReactionsButton({
  postId,
  selectedReaction,
  setSelectedReaction = () => {},
  checkInitialReaction = async () => {},
  fetchReactions,
}: ReactionsProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (postId && user?.id) {
      checkInitialReaction();
    }
  }, [checkInitialReaction, postId, user?.id, setSelectedReaction]);

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
      await checkInitialReaction(); // Re-check the user's reaction after creating
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
    <div className="flex-1 flex relative justify-center text-foreground/70 hover:text-foreground hover:bg-[#3a3a4c] transition-all p-1 rounded-sm">
      <button
        className="flex justify-center w-full cursor-pointer text-xl"
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
              className="inline-block text-foreground"
            >
              {reactionsMap[selectedReaction as ReactionType]}
            </motion.span>
          </AnimatePresence>
        ) : (
          <ThumbsUpIcon size={22} />
        )}
      </button>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex p-1 absolute bottom-10 left-0 z-50 cursor-pointer bg-card rounded-lg shadow-md ring-1 ring-border" // Adjust positioning & styling
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
  );
}
