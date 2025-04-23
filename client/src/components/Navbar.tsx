"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="w-full bg-card mb-10">
      <nav className="flex justify-between items-center p-4 mx-4">
        <Link href="/" className="hover:text-foreground/80">
          Home
        </Link>

        <button
          onClick={logout}
          className="hover:text-foreground/80 cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
