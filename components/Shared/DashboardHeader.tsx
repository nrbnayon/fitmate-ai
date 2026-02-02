"use client";

import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { name, role, image } = useUser();

  return (
    <div className="bg-white flex flex-row justify-between items-center py-2 px-4 md:px-8 border-b border-border gap-4">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-base text-secondary mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="hidden md:flex items-center gap-6">
        {/* Notification Icon */}
        <Link 
          href="/notifications"
          className="relative p-2.5 bg-[#F5F6FA] hover:bg-gray-100 rounded-full transition-colors border border-transparent"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-blue-500" />
          {/* Notification indicator dot */}
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white translate-x-1/2 -translate-y-1/2"></span>
        </Link>

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-border">
            <Image
              src={image || "/images/avatar.png"}
              alt={name || "User"}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-sm font-bold text-foreground font-nunito">
              {name || "User"}
            </p>
            <p className="text-xs text-gray-500 font-bold capitalize">
              {role || "User"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
