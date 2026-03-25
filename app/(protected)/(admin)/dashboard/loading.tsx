import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DashboardSkeleton } from "@/components/Skeleton/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <DashboardHeader title="Dashboard" description="Xandra Platform" />
      <main className="p-4 md:p-8">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
