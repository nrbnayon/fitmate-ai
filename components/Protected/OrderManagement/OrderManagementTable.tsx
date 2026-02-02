"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { orderManagementData } from "@/data/orderManagementData";
import { OrderManagement, OrderStatus } from "@/types/orderManagement";
import { TableConfig } from "@/types/table.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { cn } from "@/lib/utils";

export default function OrderManagementTable() {
  const [data, setData] = useState<OrderManagement[]>(orderManagementData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<{ row: OrderManagement; index: number } | null>(null);

  const handleDeleteClick = (row: OrderManagement, index: number) => {
    setRowToDelete({ row, index });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete) {
      const newData = data.filter((_, i) => i !== rowToDelete.index);
      setData(newData);
      setIsDeleteModalOpen(false);
      setRowToDelete(null);
    }
  };

  const statusStyles: Record<OrderStatus, string> = {
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    shipped: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const tableConfig: TableConfig<OrderManagement> = {
    columns: [
      {
        key: "orderId",
        header: "Order ID",
        sortable: true,
      },
      {
        key: "customer",
        header: "Customer",
        sortable: true,
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
      },
      {
        key: "amount",
        header: "Amount",
        sortable: true,
      },
      {
        key: "productCount",
        header: "Number of product",
        sortable: true,
        align: "center",
        render: (value) => (
          <span className="text-secondary">{value}</span>
        ),
      },
      {
        key: "status",
        header: "Progress",
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
        onClick: (row, index) => handleDeleteClick(row, index),
        label: "Delete",
      },
    ],
    actionsLabel: "Action",
  };

  return (
    <div className="w-full">
      <DynamicTable
        data={data}
        config={tableConfig}
        filter={{ enabled: true, searchKeys: ["orderId", "customer", "status"] }}
        pagination={{ enabled: true, pageSize: 8 }}
        headerClassName="bg-[#BA4E76] text-white"
        rowClassName="border-b border-[#EAECF0]"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order Record"
        description="Are you sure you want to delete this order record? This action cannot be undone."
      />
    </div>
  );
}
