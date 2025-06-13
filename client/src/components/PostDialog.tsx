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
import Avatar from "./ui/avatar";
import AudioPlayer from "./AudioPlayer";

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
        className="sm:max-w-xl bg-card border-foreground/20 text-white p-0 gap-0 
             max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="p-4 border-b border-foreground/20">
          <DialogTitle className="text-lg font-semibold text-white">
            {`${post.author.displayName}'s Post`}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white" />
        </DialogHeader>

        {/* User info */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                src={post.author.avatarUrl}
                alt="profile picture"
                size={50}
              />
            </div>
            <div>
              <p className="font-medium text-white">
                {post?.author.displayName}
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <span>{new Date(post.updatedAt).toLocaleDateString()} </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/50 hover:text-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post content */}
        <div className="px-4 py-2">
          {post.audioUrl && <AudioPlayer audioUrl={post.audioUrl} />}
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
