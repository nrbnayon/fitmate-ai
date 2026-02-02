"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { paymentHistoryData } from "@/data/paymentHistoryData";
import { PaymentHistory } from "@/types/paymentHistory";
import { TableConfig } from "@/types/table.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";

export default function PaymentHistoryTable() {
  const [data, setData] = useState<PaymentHistory[]>(paymentHistoryData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<{ row: PaymentHistory; index: number } | null>(null);

  const handleDeleteClick = (row: PaymentHistory, index: number) => {
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

  const tableConfig: TableConfig<PaymentHistory> = {
    columns: [
      {
        key: "paymentId",
        header: "Payment ID",
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
        key: "transaction",
        header: "Transaction",
        sortable: true,
        render: (value) => (
          <span className="capitalize">{value}</span>
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
        filter={{ enabled: true, searchKeys: ["paymentId", "customer", "transaction"] }}
        pagination={{ enabled: true, pageSize: 8 }}
        headerClassName="bg-[#BA4E76] text-white"
        rowClassName="border-b border-[#EAECF0]"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Record"
        description="Are you sure you want to delete this payment record? This action cannot be undone."
      />
    </div>
  );
}
