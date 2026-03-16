"use client";

import { useMemo, useState } from "react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableColumn } from "@/types/table.types";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import SearchBar from "@/components/Shared/SearchBar";
import { toast } from "sonner";
import { UserDetailsModal } from "./UserDetailsModal";
import { useGetUsersQuery, useGetCreatorsQuery, useDeleteUserMutation } from "@/redux/services/userApi";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { UserListItem } from "@/types/userManagement.types";
import { useEffect } from "react";

export default function UserManagementTable() {
  const [activeTab, setActiveTab] = useState<"All" | "Users" | "Creators">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  const pageSize = 10;
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<"user" | "creator" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Users
  const { 
    data: userData, 
    isLoading: isUsersLoading 
  } = useGetUsersQuery(
    { page, page_size: pageSize, search: searchQuery },
    { skip: activeTab === "Creators" }
  );

  // Fetch Creators
  const { 
    data: creatorData, 
    isLoading: isCreatorsLoading
  } = useGetCreatorsQuery(
    { page, page_size: pageSize, search: searchQuery },
    { skip: activeTab === "Users" }
  );

  const [deleteUser] = useDeleteUserMutation();

  const combinedData = useMemo(() => {
    const users = userData?.data?.results || [];
    const creators = creatorData?.data?.results || [];
    
    if (activeTab === "Users") return users;
    if (activeTab === "Creators") return creators;
    
    // For "All", deduplicate and prioritize creator status
    const uniqueMap = new Map<string, UserListItem>();
    
    // Process users first, then creators to overwrite
    users.forEach(u => uniqueMap.set(u.id, { ...u }));
    creators.forEach(c => {
        const existing = uniqueMap.get(c.id);
        uniqueMap.set(c.id, { 
            ...(existing || {}), 
            ...c, 
            creator: c.creator || existing?.creator || false 
        });
    });
    
    return Array.from(uniqueMap.values()).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [activeTab, userData, creatorData]);

  // If we are merging two lists locally, totalItems should match the combined set
  const totalItems = activeTab === "All" 
    ? combinedData.length 
    : (activeTab === "Creators" ? creatorData?.data?.total : userData?.data?.total) || 0;

  const isLoading = activeTab === "Creators" ? isCreatorsLoading : 
                    activeTab === "Users" ? isUsersLoading : 
                    (isUsersLoading || isCreatorsLoading);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  const columns: TableColumn<UserListItem>[] = [
    {
      key: "full_name",
      header: "Name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
            <Image
              src={row.profile_picture || "/images/avatar.png"}
              alt={row.full_name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-foreground">{row.full_name}</span>
        </div>
      ),
      sortable: true,
      width: "30%",
    },
    {
      key: "email",
      header: "Email address",
      accessor: "email",
      width: "25%",
    },
    {
      key: "created_at",
      header: "Joined",
      render: (val) => isMounted ? new Date(val).toLocaleDateString() : "...",
      sortable: true,
    },
    {
        key: "creator",
        header: "User type",
        render: (_, row) => {
            const isCreator = row.creator;
            const bgClass = isCreator ? "bg-[#E3EFFC] text-[#175CD3]" : "bg-[#F4EBFF] text-[#6941C6]";
            const text = isCreator ? "Creator" : "User";

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgClass}`}>
                    {text}
                </span>
            )
        }
    }
  ];

  const actions = [
    {
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 transition-colors cursor-pointer" />,
      onClick: (row: UserListItem) => handleDelete(row.id),
      requiresConfirmation: true,
      confirmationConfig: {
          title: "Delete User",
          description: "Are you sure you want to delete this user? This action cannot be undone.",
          type: "delete" as const,
      }
    },
  ];

  return (
    <div className="space-y-6">
        {/* Controls Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex items-center p-1 bg-white rounded-lg border border-gray-100/50">
                {(["All", "Users", "Creators"] as const).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="w-full md:w-auto">
                <SearchBar 
                    placeholder="Search users..." 
                    className="w-full md:w-[300px] bg-white border border-gray-200" 
                    onSearch={(query) => {
                        setSearchQuery(query);
                        setPage(1);
                    }}
                />
            </div>
        </div>

        {/* Table Area */}
        {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <TableSkeleton rowCount={pageSize} />
            </div>
        ) : (
            <DynamicTable
                data={combinedData}
                config={{
                    columns,
                    showActions: true,
                    actions,
                    actionsLabel: "Action",
                    actionsAlign: "center",
                }}
                pagination={{ 
                    enabled: true, 
                    pageSize,
                    currentPage: page,
                    onPageChange: setPage,
                    totalItems
                }}
                className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
                headerClassName="bg-primary text-white"
                onRowClick={(row) => {
                    setSelectedUserId(row.id);
                    setSelectedUserRole(row.creator ? "creator" : "user");
                    setIsModalOpen(true);
                }}
            />
        )}

        {/* User Details Modal */}
        <UserDetailsModal 
            userId={selectedUserId}
            userRole={selectedUserRole}
            isOpen={isModalOpen} 
            onClose={() => {
                setIsModalOpen(false);
                setSelectedUserId(null);
                setSelectedUserRole(null);
            }} 
        />
    </div>
  );
}
