"use client";

import { DynamicTable } from "@/components/Shared/DynamicTable";
import { commissionTrackingData } from "@/data/commissionTrackingData";
import { CommissionTracking, PayoutStatus } from "@/types/commissionTracking";
import { TableConfig } from "@/types/table.types";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CommissionTrackingTable() {
  const [data] = useState<CommissionTracking[]>(commissionTrackingData);

  const statusStyles: Record<PayoutStatus, string> = {
    paid: "text-emerald-500 font-medium",
    pending: "text-amber-500 font-medium",
  };

  const tableConfig: TableConfig<CommissionTracking> = {
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
        key: "totalSales",
        header: "Total Sales",
        sortable: true,
      },
      {
        key: "commission",
        header: "Commission (15%)",
        sortable: true,
      },
      {
        key: "status",
        header: "Progress",
        sortable: true,
        render: (value: PayoutStatus) => (
          <span className={cn(
            "capitalize",
            statusStyles[value]
          )}>
            {value}
          </span>
        ),
      },
    ],
    showActions: false,
  };

  return (
    <div className="w-full">
      <DynamicTable
        data={data}
        config={tableConfig}
        filter={{ enabled: true, searchKeys: ["creator", "status"] }}
        pagination={{ enabled: true, pageSize: 8 }}
        headerClassName="bg-[#BA4E76] text-white"
        rowClassName="border-b border-[#EAECF0]"
      />
    </div>
  );
}
