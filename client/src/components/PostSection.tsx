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
import { useState, useEffect } from "react";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Post } from "@/types/post";
import { Input } from "./ui/input";
import AudioPlayer from "./AudioPlayer";
import { Upload } from "lucide-react";

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
  const [preview, setPreview] = useState<string | null>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const audioFile = watch("audio");

  // Update preview when audioFile changes
  useEffect(() => {
    // Check if audioFile exists and is a File object
    if (audioFile && audioFile instanceof File) {
      // Directly create the object URL from the File object
      const objectUrl = URL.createObjectURL(audioFile);
      setPreview(objectUrl);
      console.log("Preview updated:", objectUrl);

      // Cleanup the object URL on unmount or when audioFile changes
      return () => {
        URL.revokeObjectURL(objectUrl);
        console.log("Object URL revoked:", objectUrl);
      };
    } else {
      // If no file is selected or audioFile is not a File, clear the preview
      setPreview(null);
      console.log("Preview cleared.");
    }
  }, [audioFile]);

  // Remove preview when dialog is closed
  useEffect(() => {
    if (!dialogOpen) {
      setPreview(null);
      reset();
    }
  }, [dialogOpen, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith("audio/")) return;
      setValue("audio", event.target.files[0]);
    }
  };

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
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(submitPost)}>
              <DialogHeader>
                <DialogTitle className="text-center">Create post</DialogTitle>
              </DialogHeader>
              <label htmlFor="audio-upload" className="mb-5">
                {preview ? (
                  <AudioPlayer audioUrl={preview} />
                ) : (
                  <div className="border border-dashed border-foreground/30 rounded-lg p-13 w-full max-w-md flex flex-col items-center justify-center cursor-pointer mt-5">
                    <Upload size={30} className="text-primary mb-2" />
                    <p className="text-primary mb-4">
                      Click to upload an audio
                    </p>
                    <Input
                      id="audio-upload"
                      onChange={handleFileChange}
                      type="file"
                      accept="audio/*"
                      className="absolute inset-0 opacity-0"
                    />
                  </div>
                )}
              </label>
              {errors.audio && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.audio.message}
                </p>
              )}
              <Textarea
                placeholder="What's on your mind?"
                className="resize-none h-44 !text-lg my-4"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm mb-2 text-red-500">
                  {errors.content.message}
                </p>
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
