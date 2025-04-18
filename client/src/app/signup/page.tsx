"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import axios from "axios";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const { firstName, lastName, email, password } = formData;

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await axios.post(`${baseUrl}/auth/signup`, {
          email,
          password,
          firstName,
          lastName,
        });

        console.log("User created:", response.data);
        router.push("/login"); // redirect to login
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Signup failed:", error.response?.data);
        } else {
          console.error("An unexpected error occurred:", error);
        }
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-[#2a2a3c] border-[#3a3a4c] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-[#2a2a3c] border-[#3a3a4c] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-[#2a2a3c] border-[#3a3a4c] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
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
