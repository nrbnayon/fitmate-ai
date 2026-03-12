"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingInput } from "@/components/ui/floating-input";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/features/authSlice";
import { useLoginMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import { loginValidationSchema } from "@/lib/formDataValidation";
import { RightSideImage } from "./RightSideImage";

type FormValues = z.infer<typeof loginValidationSchema>;

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Trim spaces in real-time for email & password
  const handleTrimChange = (field: "email" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trim();
    setValue(field, trimmed, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login({
        email: data.email.trim(),
        password: data.password.trim(),
      }).unwrap();

      if (response.success && response.data) {
        dispatch(loginSuccess(response.data));
        toast.success(response.message || "Logged in successfully!");
        router.push("/");
      } else {
        toast.error(response.message || "Login failed.");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = (error as any)?.data?.message || "Login failed. Please check your credentials.";
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Log In</h1>
            <p className="text-lg sm:text-xl text-secondary">
              Please login to continue to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FloatingInput
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              labelClassName="text-secondary"
              className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 text-base"
              {...register("email")}
              onChange={handleTrimChange("email")}
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                error={errors.password?.message}
                labelClassName="text-secondary"
                className="h-14 rounded-full border-2 focus:border-primary focus:ring-0 px-6 pr-14 text-base"
                {...register("password")}
                onChange={handleTrimChange("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>

            {/* Remember me */}
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="rememberMe"
                    className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm sm:text-base text-secondary cursor-pointer font-normal select-none"
                  >
                    Keep me logged in
                  </Label>
                </div>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>

            {/* Forgot password */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-secondary">Forgot Password? </span>
              <Link
                href="/forgot-password"
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Right - Image (hidden on mobile) */}
      <RightSideImage />
    </div>
  );
};