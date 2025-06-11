"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <header className="w-full bg-card mb-5">
      <nav className="flex justify-between items-center p-2 mx-4">
        <Link href="/" className="hover:text-foreground/80">
          <Avatar src="/blue_logo.png" alt="profile picture" size={50} />
        </Link>

        <button
          onClick={logout}
          className="hover:text-foreground/80 cursor-pointer"
        >
          <Avatar src={user.avatarUrl} alt="profile picture" size={45} />
        </button>
      </nav>
    </header>
  );
}
