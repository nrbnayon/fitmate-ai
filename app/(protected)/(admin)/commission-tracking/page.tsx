import DashboardHeader from "@/components/Shared/DashboardHeader";
import CommissionTrackingTable from "@/components/Protected/CommissionTracking/CommissionTrackingTable";
import { StatsCard } from "@/components/Shared/StatsCard";
import { DollarSign, CheckCircle2 } from "lucide-react";

export default function CommissionTrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <DashboardHeader 
        title="Commission Tracking" 
        description="Xandra Platform" 
      />
      
      <main className="p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Pending Payouts"
            value="$426.50"
            subtitle="last month"
            icon={DollarSign}
            iconColor="#BA4E76"
            iconBgColor="#BA4E761A"
          />
          <StatsCard
            title="Pending Payouts"
            value="$426.50"
            subtitle="last month"
            icon={CheckCircle2}
            iconColor="#10B981"
            iconBgColor="#10B9811A"
          />
        </div>

        <CommissionTrackingTable />
      </main>
    </div>
  );
}
