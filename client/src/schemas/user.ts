import { z } from "zod";

export const userProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(20, "Display name must not exceed 20 characters"),
  bio: z.string().max(160, "Bio must not exceed 160 characters").optional(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files are allowed"
    )
    .optional(),
});

export type userProfileData = z.infer<typeof userProfileSchema>;
