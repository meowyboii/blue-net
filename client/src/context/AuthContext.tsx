"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auto-load user when app starts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/me");
        setUser(data);
      } catch (error) {
        console.log("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
    router.push("/login");
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { data } = await axios.get("/api/me");
        setUser(data);
        return { success: true };
      }
      return { success: false, message: "Unexpected response from server." };
    } catch (error) {
      let message = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          "Invalid credentials. Please try again.";
      } else {
        console.error("An unexpected error occurred:", error);
      }
      setUser(null);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
