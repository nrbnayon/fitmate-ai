"use client";

import { useMemo } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { DollarSign, Users, Eye, Activity } from "lucide-react";
import { RevenueChart } from "@/components/Protected/Dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/Protected/Dashboard/UserGrowthChart";
import { TopCreatorsTable } from "@/components/Protected/Dashboard/TopCreatorsTable";
import { useGetDashboardDataQuery } from "@/redux/services/dashboardApi";
import { DashboardSkeleton } from "@/components/Skeleton/DashboardSkeleton";

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();

  // Format stats for display
  const stats = useMemo(() => {
    if (!dashboardData) return null;
    const { cards } = dashboardData;
    return [
      {
        title: "Monthly Revenue",
        value: `$${cards.monthly_revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        icon: DollarSign,
        iconColor: "#FFFFFF",
        iconBgColor: "#C14A7A",
        subtitle: "Current month",
        isUp: true,
      },
      {
        title: "Total Users",
        value: cards.total_users.toString(),
        icon: Users,
        iconColor: "#FFFFFF",
        iconBgColor: "#C14A7A",
        subtitle: "Active users",
        isUp: true,
      },
      {
        title: "Total Views",
        value: cards.total_views.toString(),
        icon: Eye,
        iconColor: "#FFFFFF",
        iconBgColor: "#C14A7A",
        subtitle: "All time",
        isUp: true,
      },
      {
        title: "Videos Posted",
        value: cards.videos_posted.toString(),
        icon: Activity,
        iconColor: "#FFFFFF",
        iconBgColor: "#C14A7A",
        subtitle: "Total videos",
        isUp: true,
      },
    ];
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <DashboardHeader title="Dashboard" description="Xandra Platform" />
        <main className="p-4 md:p-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <DashboardHeader title="Dashboard" description="Xandra Platform" />
        <main className="p-4 md:p-8">
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {error ? "Error Loading Dashboard" : "No Dashboard Data"}
              </h3>
              <p className="text-secondary text-sm">
                {error
                  ? "Something went wrong while fetching the dashboard information. Please try again later."
                  : "We couldn't find any dashboard data to display at this time."}
              </p>
              {error && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#C14A7A] text-white rounded-lg text-sm font-medium hover:bg-[#A33D65] transition-colors"
                >
                  Reload Page
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <DashboardHeader title="Dashboard" description="Xandra Platform" />

      <main className="p-4 md:p-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              iconBgColor={stat.iconBgColor}
              subtitle={stat.subtitle}
              isUp={stat.isUp}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={dashboardData.revenue_trend} />
          <UserGrowthChart data={dashboardData.user_growth} />
        </div>

        {/* Top Creators Table */}
        <TopCreatorsTable creators={dashboardData.top_creators} />
      </main>
    </div>
  );
}
