"use client";

import { signUpSchema, SignUpData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await axios.post(`${baseUrl}/auth/signup`, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      console.log("User created:", response.data);
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup failed:", error.response?.data);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a24] flex items-center justify-center">
      <div className="space-y-6 bg-[#242436] p-8 rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="text-gray-400">Enter your information to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">
                First name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="bg-[#2a2a3c] border-[#3a3a4c] text-white"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">
                Last name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="bg-[#2a2a3c] border-[#3a3a4c] text-white"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Sign Up
          </Button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#3b82f6] hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
