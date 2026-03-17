"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { Order, OrderStatus } from "@/types/orderManagement";
import { TableConfig } from "@/types/table.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { useState, useMemo } from "react";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import { 
  useGetOrdersQuery, 
  useDeleteOrderMutation 
} from "@/redux/services/productApi";
import { toast } from "sonner";

export default function OrderManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: response, isLoading, isFetching } = useGetOrdersQuery({
    page: currentPage,
    page_size: pageSize,
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<Order | null>(null);

  const handleDeleteClick = (row: Order) => {
    setRowToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (rowToDelete) {
      try {
        const res = await deleteOrder(rowToDelete.id).unwrap();
        if (res.success) {
          toast.success(res.message || "Order deleted successfully");
        } else {
          toast.error(res.message || "Failed to delete order");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "An error occurred while deleting");
      } finally {
        setIsDeleteModalOpen(false);
        setRowToDelete(null);
      }
    }
  };

  const statusStyles: Record<OrderStatus, string> = {
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    shipped: "bg-purple-50 text-purple-600 border-purple-100",
    paid: "bg-blue-50 text-blue-600 border-blue-100",
    cancelled: "bg-gray-50 text-gray-600 border-gray-100",
  };

  const tableData = useMemo(() => response?.data?.orders || [], [response]);

  const tableConfig: TableConfig<Order> = {
    columns: [
      {
        key: "id",
        header: "Order ID",
        sortable: true,
        render: (value) => `#${value}`,
      },
      {
        key: "full_name",
        header: "Customer",
        sortable: true,
      },
      {
        key: "created_at",
        header: "Date",
        sortable: true,
        render: (value) => new Date(value).toLocaleDateString(),
      },
      {
        key: "total_amount",
        header: "Amount",
        sortable: true,
        render: (value) => `$${parseFloat(value).toFixed(2)}`,
      },
      {
        key: "delivery_method",
        header: "Delivery",
        sortable: true,
        render: (value) => <span className="capitalize">{value.replace("_", " ")}</span>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (value: OrderStatus) => (
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border capitalize",
            statusStyles[value]
          )}>
            {value}
          </span>
        ),
      },
    ],
    showActions: true,
    actions: [
      {
        icon: (
          <HugeiconsIcon
            icon={Delete02Icon}
            size={20}
            className="text-secondary cursor-pointer hover:text-red-500 transition-colors"
          />
        ),
        onClick: (row) => handleDeleteClick(row),
        label: "Delete",
      },
    ],
    actionsLabel: "Action",
  };

  return (
    <div className="w-full">
      <DynamicTable
        data={tableData}
        config={tableConfig}
        loading={isLoading || isFetching}
        filter={{ 
          enabled: true, 
          searchKeys: ["full_name", "status"] 
        }}
        pagination={{ 
          enabled: true, 
          pageSize: pageSize,
          totalItems: response?.data?.total || 0,
          currentPage: currentPage,
          onPageChange: (page) => setCurrentPage(page)
        }}
        headerClassName="bg-[#BA4E76] text-white"
        rowClassName="border-b border-[#EAECF0]"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
