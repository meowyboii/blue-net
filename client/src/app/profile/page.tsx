"use client";
import FollowSection from "@/components/FollowSection";
import MenuSection from "@/components/MenuSection";
import Navbar from "@/components/Navbar";
import PostSection from "@/components/PostSection";
import ProfileSection from "@/components/ProfileSection";
import { useAuth } from "@/context/AuthContext";
import { getUserPosts } from "@/lib/posts/getPosts";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-[1fr_2fr_1fr] gap-15">
        <MenuSection />
        <div>
          <ProfileSection />
          <PostSection
            title="My Posts"
            queryKey={["posts", "user", user?.id]}
            getPosts={getUserPosts}
          />
        </div>
        <FollowSection />
      </main>
    </div>
  );
}
