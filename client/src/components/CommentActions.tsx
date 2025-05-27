import ReactionsButton from "./ReactionsButton";
import { MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ReactionCount } from "@/types/reaction";
import { ReactionType } from "@/types/enums";
import { Post } from "@/types/post";

interface CommentActionsProps {
  post: Post;
  topReactions: ReactionCount[];
  totalCount: number;
  selectedReaction: ReactionType | null;
  setSelectedReaction: (reaction: ReactionType | null) => void;
  checkInitialReaction: () => Promise<void>;
  fetchReactions: () => Promise<void>;
}

export default function CommentActions({
  post,
  selectedReaction,
  setSelectedReaction = () => {},
  checkInitialReaction = async () => {},
  fetchReactions,
}: CommentActionsProps) {
  if (!post) {
    return null;
  }
  return (
    <div className="flex items-center justify-between px-2 py-1 border-y border-foreground/15">
      <ReactionsButton
        postId={post.id}
        selectedReaction={selectedReaction}
        setSelectedReaction={setSelectedReaction}
        checkInitialReaction={checkInitialReaction}
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
