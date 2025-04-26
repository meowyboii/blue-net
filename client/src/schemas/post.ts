import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter a text content")
    .max(500, "Content is too long"),
});

export type PostData = z.infer<typeof postSchema>;
