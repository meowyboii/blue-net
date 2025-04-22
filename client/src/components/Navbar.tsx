"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // This will clear the cookie on the server
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-card mb-10">
      <nav className="flex justify-between items-center p-4 mx-4">
        <Link href="/" className="hover:text-foreground/80">
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="hover:text-foreground/80 cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
