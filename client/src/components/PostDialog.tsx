"use client";

import type React from "react";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Post } from "@/types/post";
import ReactionsCount from "./ReactionsCount";
import { ReactionCount } from "@/types/reaction";
import CommentActions from "./CommentActions";
import { ReactionType } from "@/types/enums";
import { CommentSection } from "./CommentSection";

interface PostDialogProps {
  post: Post | null;
  topReactions: ReactionCount[];
  totalCount: number;
  selectedReaction: ReactionType | null;
  setSelectedReaction: (reaction: ReactionType | null) => void;
  checkInitialReaction: () => Promise<void>;
  fetchReactions: () => Promise<void>;
  trigger?: React.ReactNode;
}

export default function PostDialog({
  post,
  topReactions,
  totalCount,
  selectedReaction,
  setSelectedReaction = () => {},
  checkInitialReaction = async () => {},
  fetchReactions,
  trigger,
}: PostDialogProps) {
  const [open, setOpen] = useState(false);

  if (!post) {
    return null; // loading state
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="sm:max-w-xl bg-[#242436] border-[#3a3a4c] text-white p-0 gap-0 
             max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="p-4 border-b border-[#3a3a4c]">
          <DialogTitle className="text-lg font-semibold text-white">
            {`${post.author.firstName}'s Post`}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white" />
        </DialogHeader>

        {/* User info */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
                {post.author.firstName?.charAt(0)}
                {post.author.lastName?.charAt(0)}
              </span>
              {/* {user.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#242436]"></div>
              )} */}
            </div>
            <div>
              <p className="font-medium text-white">
                {post?.author.firstName} {post?.author.lastName}
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <span>{new Date(post.updatedAt).toLocaleDateString()} </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post content */}
        <div className="px-4 py-2">
          <p className="text-white whitespace-pre-line mb-5">{post.content}</p>
          <ReactionsCount topReactions={topReactions} totalCount={totalCount} />
          <CommentActions
            post={post}
            topReactions={topReactions}
            totalCount={totalCount}
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
            checkInitialReaction={checkInitialReaction}
            fetchReactions={fetchReactions}
          />
        </div>
        <CommentSection postId={post.id} />
      </DialogContent>
    </Dialog>
  );
}
