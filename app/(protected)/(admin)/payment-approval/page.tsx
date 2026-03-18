import DashboardHeader from "@/components/Shared/DashboardHeader";
import PaymentApprovalClient from "@/components/Protected/PaymentApproval/PaymentApprovalClient";

export default function PaymentApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <DashboardHeader
        title="Payment Approval"
        description="Review and manage pending withdrawal requests."
      />
      <main className="p-4 md:p-8 flex-1 flex flex-col">
        <PaymentApprovalClient />
      </main>
    </div>
  );
}
