"use client";

import { useMemo, useState } from "react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableColumn } from "@/types/table.types";
import { Product } from "@/types/products";
import { PencilLine, Trash2, Plus, ChevronDown, Loader2 } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { toast } from "sonner";
import { ProductModal } from "./ProductModal";
import { Button } from "@/components/ui/button";
import { 
  useGetProductsQuery, 
  useGetProductCategoriesQuery, 
  useDeleteProductMutation 
} from "@/redux/services/productApi";
import Image from "next/image";

export default function ProductsTable() {
  const [activeTab, setActiveTab] = useState<"All" | "Product list">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  
  // RTK Query hooks
  const { data: productsData, isLoading: isProductsLoading, isFetching: isProductsFetching } = useGetProductsQuery({
    category: categoryFilter !== "All" ? categoryFilter : undefined,
    page,
    page_size: pageSize,
  });

  const { data: categoriesData } = useGetProductCategoriesQuery({});
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const products = useMemo(() => productsData?.data?.products || [], [productsData]);
  const totalProducts = productsData?.data?.total || 0;
  const categoriesList = categoriesData?.data?.results?.categories || [];

  const filteredData = useMemo(() => {
    if (!searchQuery) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.category_name.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleDelete = async (row: Product) => {
    try {
      await deleteProduct(row.id).unwrap();
      toast.success("Product deleted successfully!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      toast.error(message);
    }
  };

  // Helper for category badge color
  const getCategoryBadgeStyle = (category: string) => {
    switch(category.toLowerCase()) {
        case 'lipstick': return 'bg-[#4094F7] text-white'; 
        case 'blush': return 'bg-[#89B374] text-white';  
        case 'foundation': return 'bg-[#008F8F] text-white'; 
        case 'eyeshadow': return 'bg-[#5C5C99] text-white'; 
        case 'mascara': return 'bg-[#D68F5C] text-white';
        default: return 'bg-gray-200 text-gray-700';
    }
  };

  const columns: TableColumn<Product>[] = [
    {
      key: "image",
      header: "Image",
      render: (_, row) => (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
          <Image 
            src={row.image || "/images/placeholder-product.png"} 
            alt={row.name} 
            fill 
            className="object-cover"
          />
        </div>
      ),
      width: "80px",
    },
    {
      key: "name",
      header: "Product Name",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{row.name}</span>
          <span className="text-xs text-gray-500">{row.brand}</span>
        </div>
      ),
      sortable: true,
      width: "25%",
    },
    {
      key: "shade",
      header: "Shade",
      accessor: "shade",
    },
    {
      key: "price",
      header: "Price",
      render: (_, row) => <span>${parseFloat(row.price).toFixed(2)}</span>,
      sortable: true,
    },
    {
        key: 'category',
        header: 'Category',
        render: (_, row) => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeStyle(row.category_name)}`}>
                {row.category_name}
            </span>
        )
    }
  ];

  const actions = [
    {
      label: "Edit",
      icon: <PencilLine className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />,
      onClick: (row: Product) => {
          setEditingProduct(row);
          setIsModalOpen(true);
      },
      show: () => true,
    },
    {
      label: "Delete",
      icon: isDeleting ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />,
      onClick: (row: Product) => handleDelete(row),
      requiresConfirmation: true,
      confirmationConfig: {
          title: "Delete Product",
          description: "Are you sure you want to delete this product? This action cannot be undone.",
          type: "delete" as const,
      }
    },
  ];

  return (
    <>
        {/* Controls Header */}
        <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex flex-col gap-6">
            
            {/* Top Row: Tabs left, Add Button right */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center p-1 bg-white rounded-lg border border-gray-100/50">
                    <button 
                        onClick={() => {
                            setActiveTab("All");
                            setCategoryFilter("All");
                            setPage(1);
                        }}
                        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'All' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setActiveTab("Product list")}
                        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Product list' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                    >
                        Product list
                    </button>
                </div>

                <Button 
                    onClick={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/80 text-white gap-2 px-6"
                >
                    <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                        <Plus size={12} strokeWidth={3} />
                    </div>
                    Add
                </Button>
            </div>

            {/* Bottom Row: Filter & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="relative">
                    {activeTab === 'Product list' && (
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                                {categoryFilter === 'All' ? 'Filter By' : categoryFilter}
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block z-20 max-h-64 overflow-y-auto">
                                <button 
                                    onClick={() => {
                                      setCategoryFilter("All");
                                      setPage(1);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    All
                                </button>
                                {categoriesList.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => {
                                          setCategoryFilter(cat.name);
                                          setPage(1);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchBar 
                        placeholder="Search product name or brand" 
                        className="w-full md:w-[300px] bg-white border border-gray-200" 
                        onSearch={setSearchQuery}
                    />
                 </div>
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
          pagination={{ 
            enabled: true, 
            pageSize: pageSize, 
            totalItems: totalProducts,
            onPageChange: (p) => setPage(p),
            currentPage: page
          }}
          loading={isProductsLoading || isProductsFetching}
          emptyMessage="No products found. Try adjusting your search or filters."
          className="border border-gray-100 shadow-sm rounded-b-2xl overflow-hidden"
          headerClassName="bg-primary text-white font-nunito"
          rowClassName="font-nunito"
        />

        {/* Add/Edit Modal */}
        <ProductModal
            key={isModalOpen ? (editingProduct?.id || "new-product") : "closed"}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            product={editingProduct}
            categories={categoriesList}
        />
    </>
  );
}
