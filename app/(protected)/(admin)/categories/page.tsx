import DashboardHeader from "@/components/Shared/DashboardHeader";
import CategoriesTable from "@/components/Protected/Categories/CategoriesTable";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DashboardHeader title="Category Management" description="Xandra Platform" />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <CategoriesTable />
      </main>
    </div>
  );
}
