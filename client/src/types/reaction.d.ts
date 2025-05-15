import { ReactionType } from "./reactionType";
export interface ReactionData {
  type: ReactionType;
  postId: string;
}

export interface Reaction {
  userId: string;
  type: ReactionType;
}
export interface ReactionCount {
  type: string;
  count: number;
}
