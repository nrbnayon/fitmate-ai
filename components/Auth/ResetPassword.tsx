"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import { RightSideImage } from "./RightSideImage";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user came from verified OTP (optional security, can be disabled for testing)
    const isVerified = document.cookie.split("; ").find(row => row.startsWith("reset_verified="));
    if (!isVerified && process.env.NODE_ENV === "production") {
      toast.error("Unauthorized access. Please verify OTP first.");
      router.push("/forgot-password");
    }
  }, [router]);

  const handleTrimChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trim();
    setValue(field, trimmed, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Password Reset Data:", data);
      
      toast.success("Password reset successfully! Please login.");
      
      // Clear the verification cookie
      document.cookie = "reset_verified=; path=/; max-age=0; SameSite=Strict";
      
      router.push("/signin"); 
    } catch (error) {
      console.error("Reset failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col lg:flex-row">
      {/* Left - Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white lg:min-h-screen"
      >
        <div className="w-full max-w-md lg:max-w-lg space-y-8">
          {/* Logo + Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-6 md:mb-8">
              <Image
                src="/icons/logo.svg"
                alt="Xandra Logo"
                width={140}
                height={140}
                className="w-28 sm:w-36 h-auto"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Reset password</h1>
            <p className="text-base sm:text-lg text-secondary">
              Please reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password */}
            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? "text" : "password"}
                error={errors.newPassword?.message}
                labelClassName="text-secondary"
                className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
                {...register("newPassword")}
                onChange={handleTrimChange("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10 p-1"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            {/* Rewrite Password */}
            <div className="relative">
              <FloatingInput
                label="Rewrite Password"
                type={showConfirmPassword ? "text" : "password"}
                error={errors.confirmPassword?.message}
                labelClassName="text-secondary"
                className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
                {...register("confirmPassword")}
                onChange={handleTrimChange("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10 p-1"
              >
                {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Right - Image (hidden on mobile) */}
      <RightSideImage />
    </div>
  );
};

export default ResetPassword;
