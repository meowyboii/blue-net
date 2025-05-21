import { reactionsMap } from "@/constants/reactions";
import { ReactionType } from "@/types/enums";
import { ReactionCount } from "@/types/reaction";

interface ReactionCountProps {
  topReactions: ReactionCount[];
  totalCount: number;
}

export default function ReactionsCount({
  topReactions,
  totalCount,
}: ReactionCountProps) {
  return (
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
  );
}
