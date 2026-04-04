"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { Commission, PayoutStatus, CommissionTrackingResponse } from "@/types/commissionTracking";
import { TableConfig } from "@/types/table.types";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CommissionTrackingTableProps {
  response?: CommissionTrackingResponse;
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
}

export default function CommissionTrackingTable({
  response,
  isLoading,
  onSearchChange,
  onPageChange,
  currentPage,
  pageSize
}: CommissionTrackingTableProps) {
  const statusStyles: Record<PayoutStatus, string> = {
    Paid: "text-emerald-500 font-medium",
    Pending: "text-amber-500 font-medium",
  };

  const tableData = useMemo(() => response?.data?.table?.commissions || [], [response]);

  const tableConfig: TableConfig<Commission> = {
    columns: [
      {
        key: "creator",
        header: "Creator",
        sortable: true,
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
      },
      {
        key: "total_sales",
        header: "Total Sales",
        sortable: true,
        render: (value) => `د.إ ${value}`,
      },
      {
        key: "commission",
        header: "Commission",
        sortable: true,
        render: (value) => `د.إ ${value}`,
      },
      // {
      //   key: "progress",
      //   header: "Progress",
      //   sortable: true,
      //   render: (value: PayoutStatus) => (
      //     <span className={cn(
      //       "capitalize",
      //       statusStyles[value]
      //     )}>
      //       {value}
      //     </span>
      //   ),
      // },
    ],
    showActions: false,
  };

  return (
    <div className="w-full">
      <DynamicTable
        data={tableData}
        config={tableConfig}
        loading={isLoading}
        filter={{ 
          enabled: true, 
          searchKeys: ["creator", "progress"],
          onSearchChange: onSearchChange
        }}
        pagination={{ 
          enabled: true, 
          pageSize: pageSize,
          totalItems: response?.data?.table?.total || 0,
          currentPage: currentPage,
          onPageChange: onPageChange
        }}
        headerClassName="bg-[#BA4E76] text-white"
        rowClassName="border-b border-[#EAECF0]"
      />
    </div>
  );
}
