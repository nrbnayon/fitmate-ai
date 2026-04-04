"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { PaymentHistory } from "@/types/paymentHistory";
import { TableConfig } from "@/types/table.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { useState, useMemo } from "react";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { 
  useGetPaymentHistoryQuery, 
  useDeletePaymentHistoryMutation 
} from "@/redux/services/productApi";
import { toast } from "sonner";

export default function PaymentHistoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  const { data: response, isLoading, isFetching } = useGetPaymentHistoryQuery({
    search: searchQuery || undefined,
    page: currentPage,
    page_size: pageSize,
  });

  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentHistoryMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<PaymentHistory | null>(null);

  const handleDeleteClick = (row: PaymentHistory) => {
    setRowToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (rowToDelete) {
      try {
        const res = await deletePayment(rowToDelete.id).unwrap();
        if (res.success) {
          toast.success(res.message || "Payment record deleted successfully");
        } else {
          toast.error(res.message || "Failed to delete payment record");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "An error occurred while deleting");
      } finally {
        setIsDeleteModalOpen(false);
        setRowToDelete(null);
      }
    }
  };

  const tableData = useMemo(() => response?.data?.results || [], [response]);

  const tableConfig: TableConfig<PaymentHistory> = {
    columns: [
      {
        key: "payment_id",
        header: "Payment ID",
        sortable: true,
      },
      {
        key: "customer",
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
        key: "amount",
        header: "Amount",
        sortable: true,
        render: (value) => `د.إ ${parseFloat(value).toFixed(2)}`,
      },
      {
        key: "transaction_method",
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
          searchKeys: ["payment_id", "customer", "transaction_method"],
          onSearchChange: (query) => setSearchQuery(query)
        }}
        pagination={{ 
          enabled: true, 
          pageSize: pageSize,
          totalItems: response?.data?.count || 0,
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
        title="Delete Payment Record"
        description="Are you sure you want to delete this payment record? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
