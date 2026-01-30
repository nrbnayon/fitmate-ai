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
  return (
    <div className="bg-white flex justify-between items-center border-b border-border">
      <div className="flex flex-col items-start justify-between p-4 md:px-8">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-secondary mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 md:px-8">
        {/* Notification Icon with Indicator */}
        <Link
          href='/notifications'
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {/* Notification indicator dot */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/images/avatar.png"
              alt="Admin User"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-sm font-medium text-foreground">
              Admin
            </p>
            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}