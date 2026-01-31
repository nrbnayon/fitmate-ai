import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import { usersData } from "@/data/usersData";
import { DollarSign, Users, Eye, Activity } from "lucide-react";
import { RevenueChart } from "@/components/Protected/Dashboard/RevenueChart";
import { UserGrowthChart } from "@/components/Protected/Dashboard/UserGrowthChart";
import { TopCreatorsTable } from "@/components/Protected/Dashboard/TopCreatorsTable";

export default function DashboardPage() {
  // Server-side filtering
  const creators = usersData.filter(u => u.role === 'creator');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <DashboardHeader title="Dashboard" description="Xandra Platform" />

      <main className="p-4 md:p-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Monthly Revenue"
            value="$45,234"
            icon={DollarSign}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="15.2% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Total Users"
            value="2,847"
            icon={Users}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="12.5% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Total Views"
            value="2.4M"
            icon={Eye}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="10.1% vs last month"
            isUp={true}
          />
          <StatsCard
            title="Videos Posted"
            value="342"
            icon={Activity}
            iconColor="#FFFFFF"
            iconBgColor="#C14A7A"
            subtitle="8.3% vs last month"
            isUp={true}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <UserGrowthChart />
        </div>

        {/* Top Creators Table */}
        <TopCreatorsTable creators={creators} />
      </main>
    </div>
  );
}