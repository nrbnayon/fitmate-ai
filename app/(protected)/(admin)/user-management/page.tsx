"use client";

import { useMemo, useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { usersData } from "@/data/usersData";
import { TableColumn } from "@/types/table.types";
import { User } from "@/types/users";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import SearchBar from "@/components/Shared/SearchBar";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Users" | "Creators">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    let data = usersData;
    
    // 1. Filter by Tab
    if (activeTab === "Users") {
      data = data.filter((u) => u.role === "user");
    } else if (activeTab === "Creators") {
      data = data.filter((u) => u.role === "creator");
    }

    // 2. Filter by Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter(u => 
            u.name.toLowerCase().includes(query) || 
            u.email.toLowerCase().includes(query)
        );
    }

    return data;
  }, [activeTab, searchQuery]);

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
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
      width: "25%",
    },
    {
      key: "email",
      header: "Email address",
      accessor: "email",
      className: "text-[#475467]",
      width: "20%",
    },
    {
      key: "location",
      header: "Location",
      accessor: "location",
      className: "text-[#475467]",
    },
    {
      key: "date",
      header: "Joined",
      accessor: "date",
      className: "text-[#475467]",
    },
    {
        key: "role",
        header: "User type",
        render: (_, row) => {
            const isCreator = row.role === 'creator';
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isCreator ? 'bg-[#E3EFFC] text-[#175CD3]' : 'bg-[#F4EBFF] text-[#6941C6]'}`}>
                    {row.role === 'creator' ? 'Creator' : 'Users'}
                </span>
            )
        }
    },
    {
        key: "status",
        header: "Status",
        render: (_, row) => {
            const isActive = row.status === 'Active';
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-yellow-100 text-yellow-700'}`}>
                    {row.status || 'Active'}
                </span>
            )
        }
    }
  ];

  const actions = [
    {
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />,
      onClick: (row: User) => console.log("Delete", row.id),
      requiresConfirmation: true,
      confirmationConfig: {
          title: "Delete User",
          description: "Are you sure you want to delete this user? This action cannot be undone.",
          type: "delete" as const,
      }
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="User Management" description="Xandra Platform" />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        
        {/* Controls Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex items-center p-1 bg-white rounded-lg border border-gray-100/50">
                <button 
                    onClick={() => setActiveTab("All")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'All' ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveTab("Users")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Users' ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                >
                    Users
                </button>
                <button 
                    onClick={() => setActiveTab("Creators")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Creators' ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                >
                    Creators
                </button>
            </div>

            {/* Search */}
            <div className="w-full md:w-auto">
                <SearchBar 
                    placeholder="Search" 
                    className="w-full md:w-[300px] bg-white border border-gray-200" 
                    onSearch={setSearchQuery}
                />
            </div>
        </div>

        {/* Table */}
        <DynamicTable
          data={filteredData}
          config={{
            columns,
            showActions: true,
            actions,
            actionsLabel: "Action",
            actionsAlign: "center",
          }}
          pagination={{ enabled: true, pageSize: 8 }}
          className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
          headerClassName="bg-[#C14A7A] text-white"
        />
      </main>
    </div>
  );
}
