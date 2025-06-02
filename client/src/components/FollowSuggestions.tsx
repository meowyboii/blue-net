import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { getSuggestions } from "@/lib/users/getSuggestions";
export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestionsData = await getSuggestions();
        setSuggestions(suggestionsData);
        console.log("Suggestions fetched:", suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [suggestions]);

  return (
    <>
      {suggestions.length > 0 && (
        <div className="p-4 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Suggestions for you</h2>
          <ul className="space-y-4">
            {suggestions.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-foreground">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-foreground/60">{user.email}</p>
                  </div>
                </div>
                <UserPlus
                  size={25}
                  className="text-foreground/60 hover:text-blue-400 transition-colors cursor-pointer"
                />
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full text-sm text-blue-400 hover:underline cursor-pointer">
            View All
          </button>
        </div>
      )}
    </>
  );
}
