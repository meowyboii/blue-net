"use client";

import { logInSchema, LogInData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LogIn() {
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInData>({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = async (data: LogInData) => {
    const response = await login(data.email, data.password);
    if (response.success) {
      // Redirect to home page after successful login
      router.push("/");
    } else {
      setLoginError(response.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary/10 dark:bg-background">
      <div className="space-y-6 bg-card p-8 rounded-xl shadow-lg w-96">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-card-foreground/50">Enter your credentials</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer transition-colors"
          >
            Log In
          </Button>

          <div className="text-center text-sm text-foreground/60">
            Do not have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
