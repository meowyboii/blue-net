import Link from "next/link";
import { House, LogOut, Settings, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function MenuSection() {
  const { user, logout } = useAuth();
  return (
    <section className="p-4 w-full max-w-sm font-semibold">
      <ul className="space-y-1">
        <li>
          <Link
            href="/"
            className="hover:bg-foreground/10 py-3 px-4 rounded-md flex items-center gap-4"
          >
            <House size={28} className="mx-1" strokeWidth={1.5} />
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/connections"
            className="hover:bg-foreground/10 py-3 px-4 rounded-md flex items-center gap-4"
          >
            <Users size={28} className="mx-1" strokeWidth={1.5} />
            Connections
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="hover:bg-foreground/10 py-3 px-4 rounded-md flex items-center gap-4"
          >
            <Settings size={28} className="mx-1" strokeWidth={1.5} />
            Settings
          </Link>
        </li>
        <li>
          <button
            onClick={logout}
            className="w-full hover:bg-foreground/10 py-3 px-4 rounded-md flex items-center gap-4 cursor-pointer"
          >
            <LogOut size={28} className="mx-1" strokeWidth={1.5} />
            Logout
          </button>
        </li>
      </ul>
      <Link
        href="/profile"
        className="hover:bg-foreground/10 p-2 rounded-md flex items-center gap-3 mt-5"
      >
        {user && (
          <Image
            src={user.avatarUrl}
            alt="profile picture"
            className="rounded-full bg-foreground/10"
            width={50}
            height={50}
          />
        )}
        Profile
      </Link>
    </section>
  );
}
