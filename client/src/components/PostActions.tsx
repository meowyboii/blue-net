import ReactionsButton from "./ReactionsButton";
import { MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Reaction } from "@/types/reaction";
import { Post } from "@/types/post";

interface PostActionsProps {
  post: Post | null;
  fetchReactions: () => Promise<void>;
}

export default function PostActions({
  post,
  fetchReactions,
}: PostActionsProps) {
  if (!post) {
    return null;
  }
  return (
    <div className="flex items-center justify-between px-2 py-1 border-y border-foreground/15">
      <ReactionsButton
        postId={post.id}
        initialUserReactions={post.reactions as Reaction[]}
        fetchReactions={fetchReactions}
      />
      <Button
        variant="ghost"
        className="flex-1 flex items-center justify-center gap-2 text-gray-400 "
      >
        <MessageSquare className="h-5 w-5" />
        <span>Comment</span>
      </Button>
      <Button
        variant="ghost"
        className="flex-1 flex items-center justify-center gap-2 text-gray-400 "
      >
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </Button>
    </div>
  );
}
