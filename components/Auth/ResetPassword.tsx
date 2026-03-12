"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/services/authApi";
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
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id") || "";
  const secret_key = searchParams.get("secret_key") || "";

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
    if (!user_id || !secret_key) {
      toast.error("Invalid reset link. Please start over.");
      router.push("/forgot-password");
    }
  }, [user_id, secret_key, router]);

  const handleTrimChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trim();
    setValue(field, trimmed, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPassword({
        user_id,
        secret_key,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Password reset successfully! Please login.");
        router.push("/signin");
      } else {
        toast.error(response.message || "Reset failed.");
      }
    } catch (error: unknown) {
      console.error("Reset failed:", error);
      const errorMessage = (error as any)?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
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
