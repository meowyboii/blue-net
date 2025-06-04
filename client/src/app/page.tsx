"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { postSchema, PostData } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPost } from "@/lib/posts/createPost";
import React from "react";
import PostFeed from "@/components/PostFeed";
import FollowSection from "@/components/FollowSection";
import MenuSection from "@/components/MenuSection";

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
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

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-[1fr_2fr_1fr] gap-15">
        <MenuSection />
        <div className="py-4 px-[5vw]">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-semibold">Feed</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setDialogOpen(true)}>
                  + Create new post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(submitPost)}>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Create post
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="resize-none h-44 !text-lg my-4"
                    {...register("content")}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">
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
          <PostFeed />
        </div>

        <FollowSection />
      </main>
    </div>
  );
}
