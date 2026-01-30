//app\(roles)\[...notFound]\page.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function DashboardNotFound() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-x">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center max-w-4xl"
      >
        {/* Image */}
        <motion.div variants={imageVariants} className="mb-8">
          <Image
            src="/images/404.jpg"
            alt="Under Development"
            width={600}
            height={600}
            className="rounded-2xl"
            priority
          />
        </motion.div>

        {/* Content Section */}
        <div className="text-center space-y-4 mb-4">
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-2xl lg:text-3xl font-bold text-primary tracking-tight"
          >
            {lastSegment
              ? `${lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)}`
              : "Transaction"}{" "}
            Under Construction
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-secondary max-w-md mx-auto"
          >
            We&apos;re working hard to bring this feature to life
          </motion.p>

          {/* Path Display */}
          {/* <motion.div variants={itemVariants} className="inline-block mt-4">
            <div className="px-5 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <code className="text-sm text-gray-700 font-mono">
                {pathname}
              </code>
            </div>
          </motion.div> */}
        </div>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 hover:bg-gray-50 transition-all duration-300"
          >
            <Link
              href="javascript:history.back()"
              className="flex items-center gap-2 hover:text-foreground bg-gray hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 hover:text-foreground" />
              Go Back
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-primary! hover:bg-primary/80! text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center gap-2 text-sm text-secondary"
        >
          <motion.div
            className="flex gap-1"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
          </motion.div>
          <span>Coming soon</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
