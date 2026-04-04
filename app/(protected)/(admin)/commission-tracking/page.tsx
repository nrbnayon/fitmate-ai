"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import CommissionTrackingTable from "@/components/Protected/CommissionTracking/CommissionTrackingTable";
import { StatsCard } from "@/components/Shared/StatsCard";
import { DollarSign, CheckCircle2 } from "lucide-react";
import { useGetCommissionTrackingQuery } from "@/redux/services/userApi";
import { useState } from "react";

export default function CommissionTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: response, isLoading, isFetching } = useGetCommissionTrackingQuery({
    search: searchQuery || undefined,
    page: currentPage,
    page_size: pageSize,
  });

  const summary = response?.data?.summary;

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
            value={isLoading ? "..." : `د.إ ${summary?.pending_payouts?.toFixed(2) || "0.00"}`}
            subtitle="current balance"
            icon={DollarSign}
            iconColor="#BA4E76"
            iconBgColor="#BA4E761A"
          />
          <StatsCard
            title="Total Paid/Withdraw"
            value={isLoading ? "..." : `د.إ ${(summary?.paid_payouts || summary?.total_withdraw || 0).toFixed(2)}`}
            subtitle="to date"
            icon={CheckCircle2}
            iconColor="#10B981"
            iconBgColor="#10B9811A"
          />
        </div>

        <CommissionTrackingTable 
          response={response}
          isLoading={isLoading || isFetching}
          onSearchChange={setSearchQuery}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </main>
    </div>
  );
}
