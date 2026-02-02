import DashboardHeader from "@/components/Shared/DashboardHeader";
import OrderManagementTable from "@/components/Protected/OrderManagement/OrderManagementTable";

export default function OrderManagementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <DashboardHeader 
        title="Order Management" 
        description="Xandra Platform" 
      />
      <main className="p-4 md:p-8">
        <OrderManagementTable />
      </main>
    </div>
  );
}
