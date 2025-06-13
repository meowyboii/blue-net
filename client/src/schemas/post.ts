import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter a text content")
    .max(500, "Content is too long"),
  audio: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image")
    .refine(
      (file) => file.type.startsWith("audio/"),
      "Only audio files are allowed"
    )
    .optional(),
});

export type PostData = z.infer<typeof postSchema>;
