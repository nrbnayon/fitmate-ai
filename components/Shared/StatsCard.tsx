// components/Dashboard/Shared/StatsCard.tsx
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  isUp?: boolean;
  subtitle?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  isUp,
  subtitle,
  className,
}: StatsCardProps) {
  // Extract percentage from subtitle if exists
  const percentageMatch = subtitle?.match(/(\d+\.?\d*)%/);
  const percentage = percentageMatch ? percentageMatch[1] : null;
  const subtitleText = subtitle?.replace(/(\d+\.?\d*)%\s*/, '') || '';

  return (
    <div
      className={cn(
        "bg-white px-5 py-6 rounded-lg flex items-start justify-between h-full border-none cursor-pointer transition-all hover:bg-gray-50 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 text-xs">
            {percentage && (
              <>
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-primary font-medium">{percentage}%</span>
              </>
            )}
            <span className="text-secondary">{subtitleText}</span>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-center rounded-lg p-3 min-w-[56px] min-h-[56px] mt-1"
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon
          size={28}
          style={{ color: iconColor }}
          strokeWidth={2}
        />
      </div>
    </div>
  );
}