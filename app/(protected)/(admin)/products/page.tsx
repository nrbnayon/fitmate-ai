import DashboardHeader from "@/components/Shared/DashboardHeader";
import { productsData } from "@/data/productsData";
import ProductsTable from "@/components/Protected/Products/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DashboardHeader title="Product Management" description="Xandra Platform" />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <ProductsTable initialData={productsData} />
      </main>
    </div>
  );
}
