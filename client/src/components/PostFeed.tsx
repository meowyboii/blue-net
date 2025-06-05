"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { Post } from "@/types/post";

interface PostFeedProps {
  posts: Post[] | [];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
}

export default function PostFeed({
  posts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
}: PostFeedProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  if (isLoading) {
    // Show Skeleton while first loading
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 mb-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div>
            {Array.from({ length: 2 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
