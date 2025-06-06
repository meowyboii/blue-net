import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostFeed from "@/components/PostFeed";
import { Textarea } from "@/components/ui/textarea";
import { postSchema, PostData } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPost } from "@/lib/posts/createPost";
import { useState } from "react";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Post } from "@/types/post";

interface PostSectionProps {
  title: string;
  queryKey: QueryKey;
  getPosts: (params: { skip?: number; take?: number }) => Promise<Post[]>;
}

export default function PostSection({
  title,
  queryKey,
  getPosts,
}: PostSectionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const submitPost = async (postData: PostData) => {
    setLoading(true);
    try {
      const post = await createPost(postData);

      console.log("Post created:", post);
      setDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: async ({ pageParam = 0 }) => {
        // pageParam is the `skip`
        try {
          const res = await getPosts({ skip: pageParam, take: 5 });
          return res;
        } catch (error) {
          // Throw error so React Query knows it's an error
          console.error("Error fetching posts:", error);
          throw error;
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        // If the last page has less than 5, it means no more posts
        if (lastPage.length < 5) return undefined;
        return allPages.flat().length; // next skip = total posts fetched
      },
      initialPageParam: 0,
    });

  const posts: Post[] = data?.pages.flat() ?? [];

  return (
    <section className="py-4 px-[5vw]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              + Create new post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(submitPost)}>
              <DialogHeader>
                <DialogTitle className="text-center">Create post</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="What's on your mind?"
                className="resize-none h-44 !text-lg my-4"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Posting..." : "Post"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <PostFeed
        posts={posts}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
      />
    </section>
  );
}
