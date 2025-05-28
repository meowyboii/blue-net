import { commentSchema } from "@/schemas/comment";
import { CommentData } from "@/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Send, Smile, ImageIcon, Gift, FileType } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createComment } from "@/lib/comments/createComment";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
  });
  const content = watch("content");

  const submitComment = async (commentData: CommentData) => {
    setLoading(true);
    try {
      const comment = await createComment(commentData, postId);
      console.log("Comment created:", comment);
      reset();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Submitting comment...</p>;
  }
  return (
    <form
      onSubmit={handleSubmit(submitComment)}
      className="p-4 flex items-center gap-2"
    >
      <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src="/placeholder.svg?height=32&width=32"
          alt="Your avatar"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex items-center bg-[#3a3a4c] rounded-full px-3 py-1">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 bg-transparent text-white text-sm outline-none"
          {...register("content")}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-1 hover:text-gray-300">
            <Smile className="h-5 w-5" />
          </button>
          <button className="p-1 hover:text-gray-300">
            <ImageIcon className="h-5 w-5" />
          </button>
          <button className="p-1 hover:text-gray-300">
            <Gift className="h-5 w-5" />
          </button>
          <button className="p-1 hover:text-gray-300">
            <FileType className="h-5 w-5" />
          </button>
        </div>
      </div>
      <button
        className={cn(
          "p-1 text-gray-400",
          content?.trim()
            ? "text-[#3b82f6] hover:text-[#2563eb] cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        )}
        disabled={!content?.trim()}
        type="submit"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};
