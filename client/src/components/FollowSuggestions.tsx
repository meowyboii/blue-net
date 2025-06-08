"use client";

import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { getSuggestions } from "@/lib/users/getSuggestions";
import { followUser } from "@/lib/follows/followUser";
import Link from "next/link";
import Avatar from "./ui/avatar";

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestionsData = await getSuggestions();
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const followData = await followUser(userId);
      console.log("User followed:", followData);
      // Update the suggestions state to remove the followed user
      setSuggestions((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <>
      {suggestions.length > 0 && (
        <div className="p-4 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Suggestions for you</h2>
          <ul className="space-y-4">
            {suggestions.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatarUrl}
                    alt="profile picture"
                    size={50}
                  />
                  <div>
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-foreground/60">{user.email}</p>
                  </div>
                </div>
                <UserPlus
                  size={25}
                  className="text-foreground/60 hover:text-blue-400 transition-colors cursor-pointer"
                  onClick={() => handleFollow(user.id)}
                />
              </li>
            ))}
          </ul>
          <Link href="/connections">
            <button className="mt-4 w-full text-sm text-blue-400 hover:underline cursor-pointer">
              View All
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
