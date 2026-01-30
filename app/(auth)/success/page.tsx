"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RightSideImage } from "@/components/Auth/RightSideImage";

export default function SuccessPage() {
  return (
    <div className="relative h-screen w-full flex flex-col lg:flex-row">
      {/* Left - Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white lg:min-h-screen"
      >
        <div className="w-full max-w-md lg:max-w-lg space-y-8 text-center">
          {/* Logo */}
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

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Congratulations!</h1>
            <p className="text-lg sm:text-xl text-secondary max-w-sm mx-auto">
              Your account has been created successfully. Log in to explore more.
            </p>
          </div>

          <div className="pt-4">
            <Button
              asChild
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-200 truncate"
            >
              <Link href="/signin">Log In</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Right - Image */}
      <RightSideImage />
    </div>
  );
}
