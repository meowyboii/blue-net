import { z } from "zod";
export const commentSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
});

export type CommentData = z.infer<typeof commentSchema>;
