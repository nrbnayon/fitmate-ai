import DashboardHeader from "@/components/Shared/DashboardHeader";
import PaymentHistoryTable from "@/components/Protected/PaymentHistory/PaymentHistoryTable";

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <DashboardHeader
        title="Payment History"
        description="Xandra Platform"
      />
      <main className="p-4 md:p-8">
        <PaymentHistoryTable />
      </main>
    </div>
  );
}