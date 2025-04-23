"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center min-h-screen ">
      <Navbar />
      <main>
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Blue Net {user?.email}
        </h1>
        <p className="text-lg mb-8">A social media app</p>
        <p className="text-gray-600">Your social media experience redefined.</p>
      </main>
    </div>
  );
}
