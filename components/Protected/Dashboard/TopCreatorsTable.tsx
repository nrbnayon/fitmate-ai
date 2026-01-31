"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { User } from "@/types/users";
import { TableColumn } from "@/types/table.types";

interface TopCreatorsTableProps {
  creators: User[];
}

export function TopCreatorsTable({ creators }: TopCreatorsTableProps) {
  // Columns for Top Creators
  const columns: TableColumn<User>[] = useMemo(() => [
    {
      key: "name",
      header: "Name",
      render: (_, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
             <Image
                src={row.image || "/images/avatar.png"}
                alt={row.name}
                fill
                className="object-cover"
              />
          </div>
          <span className="font-semibold text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      header: "Email address",
      accessor: "email",
    },
    {
      key: "videos",
      header: "Videos",
      accessor: "videos",
    },
    {
      key: "sales",
      header: "Sales",
      render: (_, row: User) => <span className="font-medium">${row.sales}</span>,
      sortable: true,
    },
    {
      key: "commission",
      header: "Commission",
      render: (_, row: User) => <span className="font-medium">${row.commission}</span>,
      sortable: true,
    },
  ], []);

  const actions = useMemo(() => [
    {
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 transition-colors cursor-pointer" />,
      onClick: (row: User) => console.log("Delete", row.id), 
    },
  ], []);

  return (
    <DynamicTable
      title="Top Creators"
      data={creators}
      config={{
        columns,
        showActions: true,
        actions,
        actionsLabel: "Action",
        actionsAlign: "center",
      }}
      pagination={{ enabled: false }}
      className="border border-border shadow-none overflow-hidden p-0"
      headerClassName="text-white bg-[#C14A7A]"
    />
  );
}
