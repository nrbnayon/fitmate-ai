"use client";

import { useState, useMemo } from "react";
import { 
  useGetWithdrawalsQuery, 
  useActionWithdrawalMutation 
} from "@/redux/services/productApi";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableConfig } from "@/types/table.types";
import { Withdrawal } from "@/types/paymentApproval.types";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/Shared/StatsCard";

const formatRequestedDateTime = (dateString?: string) => {
  if (!dateString) return "N/A";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PaymentApprovalClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: response, isLoading, isFetching } = useGetWithdrawalsQuery({
    search: searchQuery || undefined,
    page: currentPage,
    page_size: pageSize,
  });

  const [actionWithdrawal] = useActionWithdrawalMutation();

  const handleApprove = async (withdrawal: Withdrawal) => {
    try {
      const res = await actionWithdrawal({ id: withdrawal.id, status: "approved" }).unwrap();
      if (res.success) {
        toast.success(res.message || "Withdrawal approved successfully", {
          description: `Transfer ID: ${res.data?.transfer_id || "Processing"}`,
        });
      } else {
        toast.error(res.message || "Failed to approve withdrawal");
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "An error occurred while approving");
    }
  };

  const handleReject = async (withdrawal: Withdrawal) => {
    try {
      const res = await actionWithdrawal({ id: withdrawal.id, status: "rejected" }).unwrap();
      if (res.success) {
        toast.success(res.message || "Withdrawal rejected successfully");
      } else {
        toast.error(res.message || "Failed to reject withdrawal");
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "An error occurred while rejecting");
    }
  };

  const summaryData = response?.data?.summary;
  const tableData = useMemo(() => response?.data?.pending_withdrawals || [], [response]);
  const paginationData = response?.data?.pagination;

  const tableConfig: TableConfig<Withdrawal> = {
    columns: [
      {
        key: "id",
        header: "Request ID",
        sortable: true,
        render: (value) => <span className="font-semibold text-gray-700">#{value}</span>
      },
      {
        key: "creator",
        header: "Creator",
        sortable: false,
        render: (_, row) => (
          <div>
            <p className="font-semibold text-gray-900">{row.creator?.full_name || row.creator_name || "Unknown"}</p>
            <p className="text-xs text-gray-500">{row.creator?.email || row.creator_email || "N/A"}</p>
          </div>
        )
      },
      {
        key: "amount",
        header: "Amount",
        sortable: true,
        render: (value) => (
          <span className="font-bold text-gray-900">
            د.إ {parseFloat(value?.toString() || "0").toFixed(2)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (value) => (
          <span className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full capitalize w-fit flex items-center gap-1.5",
            value === "pending" && "bg-orange-50 text-orange-600 border border-orange-200",
            value === "processing" && "bg-blue-50 text-blue-600 border border-blue-200",
            value === "approved" && "bg-green-50 text-green-600 border border-green-200",
            value === "completed" && "bg-emerald-50 text-emerald-600 border border-emerald-200",
            value === "rejected" && "bg-red-50 text-red-600 border border-red-200"
          )}>
            {value === "pending" && <Clock className="w-3 h-3" />}
            {value === "processing" && <AlertCircle className="w-3 h-3" />}
            {value === "approved" && <CheckCircle className="w-3 h-3" />}
            {value === "completed" && <CheckCircle className="w-3 h-3" />}
            {value === "rejected" && <XCircle className="w-3 h-3" />}
            {value}
          </span>
        ),
      },
      {
        key: "requested_at",
        header: "Requested Date",
        sortable: true,
        render: (_, row) => (
          <span className="text-gray-600 whitespace-nowrap">
            {formatRequestedDateTime(row.requested_at || row.created_at)}
          </span>
        ),
      },
    ],
    showActions: true,
    actions: [
      {
        icon: (
          <CheckCircle2
             className="w-5 h-5"
          />
        ),
        onClick: (row) => handleApprove(row),
        label: "Approve Payment",
        variant: "success",
        show: (row) => row.status === "pending",
        requiresConfirmation: true,
        confirmationConfig: (row) => ({
          title: "Approve Withdrawal Request",
          description: `Are you sure you want to approve this withdrawal? This will initiate the payout process for ${row.creator?.full_name || row.creator_name || "the creator"}.`,
          confirmText: "Yes, Approve",
          cancelText: "Cancel",
          type: "warning" // Using warning type for yellow/constructive actions
        })
      },
      {
        icon: (
          <XCircle
            className="w-5 h-5"
          />
        ),
        onClick: (row) => handleReject(row),
        label: "Reject Payment",
        variant: "danger",
        show: (row) => row.status === "pending",
        requiresConfirmation: true,
        confirmationConfig: () => ({
          title: "Reject Withdrawal Request",
          description: `Are you sure you want to reject this withdrawal? The funds will remain in the creator's balance.`,
          confirmText: "Yes, Reject",
          cancelText: "Cancel",
          type: "delete" // Using delete type for red/destructive actions
        })
      },
    ],
    actionsLabel: "Actions",
    actionsWidth: "120px",
    actionsAlign: "center",
  };


  return (
    <div className="w-full flex-1 flex flex-col gap-6">
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading && !summaryData ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="bg-white px-5 py-6 rounded-2xl flex items-start justify-between h-full shadow-sm border border-slate-100">
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-8 w-16 my-2 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
             </div>
          ))
        ) : (
          <>
            <StatsCard 
              title="Pending Amount" 
              value={`د.إ ${summaryData?.total_pending_amount?.toFixed(2) || "0.00"}`}
              subtitle={`${summaryData?.total_pending || 0} requests pending`}
              icon={Clock}
              iconColor="#f97316"
              iconBgColor="#fff7ed"
            />
            <StatsCard 
              title="Completed Amount" 
              value={`د.إ ${summaryData?.total_completed_amount?.toFixed(2) || "0.00"}`}
              subtitle={`${summaryData?.total_completed || 0} requests completed`}
              icon={CheckCircle2}
              iconColor="#10b981"
              iconBgColor="#ecfdf5"
            />
            <StatsCard 
              title="Total Withdrawals" 
              value={`د.إ ${summaryData?.total_withdrawals?.toString() || "0.00"}`}
              subtitle="All time requests"
              icon={DollarSign}
              iconColor="#3b82f6"
              iconBgColor="#eff6ff"
            />
            <StatsCard 
              title="Processing" 
              value={summaryData?.total_processing?.toString() || "0"}
              subtitle="Currently processing"
              icon={AlertCircle}
              iconColor="#6366f1"
              iconBgColor="#eef2ff"
            />
          </>
        )}
      </div>

      {/* Table Section */}
      <DynamicTable
        data={tableData}
        config={tableConfig}
        loading={isLoading || isFetching}
        filter={{ 
          enabled: true, 
          searchKeys: ["id", "creator_name", "creator_email", "status"],
          onSearchChange: (query) => setSearchQuery(query)
        }}
        pagination={{ 
          enabled: true, 
          pageSize: pageSize,
          totalItems: paginationData?.total_records || tableData.length,
          currentPage: currentPage,
          onPageChange: (page) => setCurrentPage(page)
        }}
        headerClassName="bg-white border-b border-gray-100 text-gray-500 text-sm py-5"
        rowClassName="border-b border-gray-50"
      />
    </div>
  );
}

