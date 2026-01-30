"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type FormValues = z.infer<typeof otpSchema>;

const VerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "signup";

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

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("OTP:", data.otp);
      
      toast.success("Verification successful!");
      
      if (flow === "reset") {
        // Set a short-lived cookie to allow access to reset-password page
        document.cookie = "reset_verified=true; path=/; max-age=300; SameSite=Strict"; // 5 minutes
        router.push("/reset-password");
      } else {
        router.push("/signin"); 
      } 
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = () => {
    toast.info("A new code has been sent to your email.");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-pink-50 py-10">
      {/* Background Shape */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/icons/shape.png"
          alt="Background Shape"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full px-4 md:px-0 flex items-center justify-center"
      >
        <Card
          className="w-full max-w-[550px] bg-white border border-[#DDDDDD] rounded-[24px] p-0"
          style={{
            boxShadow:
              "0px 5px 11px 0px #0000000D, 0px 19px 19px 0px #0000000D, 0px 43px 26px 0px #0000000D, 0px 77px 31px 0px #00000003, 0px 120px 34px 0px #00000000",
          }}
        >
          <CardContent className="p-8 md:p-[40px]">
             {/* "Verify with OTP" matches uploaded_media_3. uploaded_media_1 says "Verify with Email". 
                 I'll stick with "Verify with OTP" as general purpose. */}
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                Verify with OTP
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-8">
                
                <div className="w-full flex justify-center">
                    <Controller
                        control={control}
                        name="otp"
                        render={({ field }) => (
                        <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="gap-2 md:gap-4">
                                {/* Customizing slots to look like separate boxes */}
                                {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot 
                                        key={index} 
                                        index={index} 
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-gray-300 first:rounded-xl last:rounded-xl text-lg md:text-xl"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                        )}
                    />
                </div>
                {errors.otp && (
                    <p className="text-sm text-red-500 mt-[-20px]">{errors.otp.message}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                   className="w-full h-13 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>

                 {/* Resend Link */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-normal text-foreground">
                    Don&apos;t receive the OTP?
                  </span>
                  <button
                    type="button"
                    onClick={onResend}
                    className="text-base font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none"
                  >
                    Resend
                  </button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
