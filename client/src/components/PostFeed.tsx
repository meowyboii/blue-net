"use client";

import { useEffect } from "react";
import { getPosts } from "@/lib/posts/getPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

export default function PostFeed() {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async ({ pageParam = 0 }) => {
        // pageParam is the `skip`
        try {
          const res = await getPosts({ skip: pageParam, take: 5 });
          await new Promise((resolve) => setTimeout(resolve, 2000));
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
      {data?.pages.flat().map((post) => (
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
