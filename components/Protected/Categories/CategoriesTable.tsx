"use client";

import { useMemo, useState } from "react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableColumn } from "@/types/table.types";
import { Trash2, PencilLine, Plus, Loader2 } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { ProductCategory } from "@/types/products";
import { useGetProductCategoriesQuery, useDeleteCategoryMutation } from "@/redux/services/productApi";
import { CategoryModal } from "./CategoryModal";

export default function CategoriesTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

    const { 
        data: categoriesData, 
        isLoading: isCategoriesLoading,
        isFetching: isCategoriesFetching
    } = useGetProductCategoriesQuery({ page, page_size: pageSize });

    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const categories = useMemo(() => categoriesData?.data?.results?.categories || [], [categoriesData]);
    const totalCategories = categoriesData?.data?.total || 0;

    const filteredData = useMemo(() => {
        if (!searchQuery) return categories;
        return categories.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const handleDelete = async (row: ProductCategory) => {
        try {
            await deleteCategory(row.id).unwrap();
            toast.success("Category deleted successfully!");
        } catch (error: unknown) {
            const apiError = error as { data?: { message?: string } };
            toast.error(apiError.data?.message || "Failed to delete category");
        }
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const columns: TableColumn<ProductCategory>[] = [
        {
            key: "name",
            header: "Category Name",
            accessor: "name",
            sortable: true,
        },
        {
            key: "slug",
            header: "Slug",
            accessor: "slug",
        },
        {
            key: "created_at",
            header: "Created At",
            render: (val) => (
                <span suppressHydrationWarning>
                    {new Date(val).toLocaleDateString()}
                </span>
            ),
            sortable: true,
        },
        {
            key: "updated_at",
            header: "Updated At",
            render: (val) => (
                <span suppressHydrationWarning>
                    {new Date(val).toLocaleDateString()}
                </span>
            ),
            sortable: true,
        }
    ];

    const actions = [
        {
            label: "Edit",
            icon: <PencilLine className="w-5 h-5 text-[#C14A7A] hover:text-[#A33E67] transition-colors cursor-pointer" />,
            onClick: (row: ProductCategory) => handleEdit(row),
        },
        {
            label: "Delete",
            icon: isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
                <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 transition-colors cursor-pointer" />
            ),
            onClick: (row: ProductCategory) => handleDelete(row),
            requiresConfirmation: true,
            confirmationConfig: {
                title: "Delete Category",
                description: "Are you sure you want to delete this category? All related products might be affected.",
                type: "delete" as const,
            }
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Product Categories</h2>
                    {isCategoriesFetching && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <SearchBar 
                        placeholder="Search categories..." 
                        className="w-full md:w-[300px]" 
                        onSearch={setSearchQuery}
                    />
                    <button 
                        onClick={handleAddNew}
                        className="w-full md:w-auto px-6 py-2.5 bg-[#C14A7A] text-white rounded-xl font-semibold shadow-md hover:bg-[#A33E67] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Table Area */}
            {isCategoriesLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <TableSkeleton rowCount={8} />
                </div>
            ) : (
                <DynamicTable
                    data={filteredData}
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
                        totalItems: totalCategories
                    }}
                    className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
                    headerClassName="bg-primary text-white"
                />
            )}

            {/* Add/Edit Modal */}
            <CategoryModal
                key={isModalOpen ? (editingCategory?.id || "new-category") : "closed"}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={editingCategory}
            />
        </div>
    );
}
