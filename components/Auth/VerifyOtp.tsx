"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "sonner";
import { useVerifyResetCodeMutation, useResendVerificationCodeMutation } from "@/redux/services/authApi";
import { RightSideImage } from "./RightSideImage";

const otpSchema = z.object({
  otp: z.string().min(4, {
    message: "Your one-time password must be 4 digits.",
  }),
});

type FormValues = z.infer<typeof otpSchema>;

const VerifyOtp = () => {
  const [verifyResetCode, { isLoading: isVerifying }] = useVerifyResetCodeMutation();
  const [resendCode, { isLoading: isResending }] = useResendVerificationCodeMutation();
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "signup";
  const email = searchParams.get("email") || "";
  const user_id = searchParams.get("user_id") || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Simple countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please try again from the start.");
      return;
    }

    try {
      const response = await resendCode({ email }).unwrap();
      if (response.success) {
        toast.success(response.message || `A new code has been sent to ${email}`);
        setCountdown(60);
      } else {
        toast.error(response.message || "Failed to resend code.");
      }
    } catch (error: unknown) {
      console.error("Resend failed:", error);
      const errorMessage = (error as any)?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (flow === "reset") {
      if (!user_id) {
        toast.error("User identification missing. Please start over.");
        return;
      }

      try {
        const response = await verifyResetCode({
          user_id,
          code: data.otp,
        }).unwrap();

        if (response.success && response.data) {
          toast.success(response.message || "Verification successful!");
          // Pass secret_key and user_id to reset-password page
          router.push(
            `/reset-password?user_id=${response.data.user_id}&secret_key=${response.data.secret_key}`
          );
        } else {
          toast.error(response.message || "Invalid code.");
        }
      } catch (error: unknown) {
        console.error("Verification failed:", error);
        const errorMessage = (error as any)?.data?.message || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
      }
    } else {
      // Handle other flows if any (e.g. signup)
      toast.info("This flow is not yet implemented with real API.");
    }
  };

  const isLoading = isVerifying || isResending;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Verify OTP</h1>
            <p className="text-base sm:text-lg text-secondary">
              Enter the 4-digit code sent to {email || "your email"}.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPGroup className="gap-2 sm:gap-4">
                      {[...Array(4)].map((_, index) => (
                        <InputOTPSlot 
                          key={index} 
                          index={index} 
                          className="w-12 h-14 sm:w-16 sm:h-16 border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>

            {/* Resend Link */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-secondary">Didn&apos;t get the email? </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isLoading}
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors disabled:opacity-70 disabled:no-underline"
              >
                {countdown > 0 ? `Resent in ${formatTime(countdown)}` : "Resend"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Right - Image (hidden on mobile) */}
      <RightSideImage />
    </div>
  );
};

export default VerifyOtp;
