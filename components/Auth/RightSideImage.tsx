
import { motion } from "framer-motion";
import Image from "next/image";

export const RightSideImage = () => {
  return (
    <>
      {/* Right - Image (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:block lg:flex-1 relative h-screen overflow-hidden"
      >
        {/* Optional subtle overlay gradient */}
        <div className="absolute inset-0 z-10 pointer-events-none" />

        <Image
          src="/images/right_auth.png"
          alt="Fitmate AI"
          fill
          className="object-center p-3 rounded-2xl"
          priority
          sizes="(min-width: 1024px) 50vw, 0"
        />
      </motion.div>
    </>
  );
};