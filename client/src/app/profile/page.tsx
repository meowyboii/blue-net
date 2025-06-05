"use client";
import FollowSection from "@/components/FollowSection";
import MenuSection from "@/components/MenuSection";
import Navbar from "@/components/Navbar";
import PostSection from "@/components/PostSection";
import ProfileSection from "@/components/ProfileSection";
import { getUserPosts } from "@/lib/posts/getPosts";

export default function Profile() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-[1fr_2fr_1fr] gap-15">
        <MenuSection />
        <div>
          <ProfileSection />
          <PostSection getPosts={getUserPosts} title="My Posts" />
        </div>
        <FollowSection />
      </main>
    </div>
  );
}
