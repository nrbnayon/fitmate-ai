import DashboardHeader from "@/components/Shared/DashboardHeader";
import { usersData } from "@/data/usersData";
import UserManagementTable from "@/components/Protected/UserManagement/UserManagementTable";

export default function UserManagementPage() {
    return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader title="User Management" description="Xandra Platform" />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <UserManagementTable initialData={usersData} />
      </main>
    </div>
  );
}
