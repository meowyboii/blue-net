import { commentSchema } from "@/schemas/comment";
import { CommentData } from "@/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send, Smile, ImageIcon, Gift, FileType } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createComment } from "@/lib/comments/createComment";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getComments } from "@/lib/comments/getComments";
import Avatar from "./ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
  });
  const queryClient = useQueryClient();
  const content = watch("content");

  const submitComment = async (commentData: CommentData) => {
    setLoading(true);
    try {
      const comment = await createComment(commentData, postId);
      console.log("Comment created:", comment);
      reset();
      // Refetch comments after submitting
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 0 }) => {
      // pageParam is the `skip`
      try {
        const res = await getComments(postId, pageParam as number, 5);
        return res;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
  });
  if (!user) return null;
  return (
    <>
      <form
        onSubmit={handleSubmit(submitComment)}
        className="p-4 flex items-center gap-2"
      >
        <Avatar src={user.avatarUrl} alt="profile picture" size={40} />
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
            <button className="p-1 hover:text-gray-300" type="button">
              <Smile className="h-5 w-5" />
            </button>
            <button className="p-1 hover:text-gray-300" type="button">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="p-1 hover:text-gray-300" type="button">
              <Gift className="h-5 w-5" />
            </button>
            <button className="p-1 hover:text-gray-300" type="button">
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
          disabled={!content?.trim() && !loading} // Disable if no content or loading
          type="submit"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="p-4">
        {data?.pages.flat().map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar
              src={comment.author.avatarUrl}
              alt="profile picture"
              size={50}
            />
            <div className="flex-1 mb-4">
              <div className="bg-[#3a3a4c] rounded-2xl px-3 py-2">
                <p className="font-medium text-white text-sm">
                  {comment.author.displayName}
                </p>
                <p className="text-white text-sm">{comment.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{comment.time}</span>
                <button className="font-medium hover:underline">Like</button>
                <button className="font-medium hover:underline">Reply</button>
              </div>
            </div>
          </div>
        ))}

        {isError && (
          <p className="text-sm text-red-500">
            Error: {(error as Error).message}
          </p>
        )}

        {(isFetchingNextPage || isLoading) && (
          <p className="text-foreground/50 text-sm">Loading comments...</p>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="text-foreground/50 text-sm hover:underline cursor-pointer "
          >
            Load More Comments
          </button>
        )}
      </div>
    </>
  );
};
