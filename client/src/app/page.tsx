"use client";

import Navbar from "@/components/Navbar";
import FollowSection from "@/components/FollowSection";
import MenuSection from "@/components/MenuSection";
import PostSection from "@/components/PostSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Navbar />
      <main className="w-full grid grid-cols-[1fr_2fr_1fr] gap-15">
        <MenuSection />
        <PostSection />
        <FollowSection />
      </main>
    </div>
  );
}
