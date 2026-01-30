"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center w-full max-w-md bg-[#F5F6FA] rounded-3xl px-4 py-2.5", className)}>
      <Search className="w-5 h-5 text-gray-400 shrink-0" />
      <input
        type="text"
        className="w-full ml-3 bg-transparent border-none text-sm focus:outline-none placeholder:text-gray-400 text-foreground"
        placeholder="Search"
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  );
}
