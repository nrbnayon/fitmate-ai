"use client";

import { useMemo, useState, useEffect } from "react";
import { DynamicTable } from "@/components/Shared/DynamicTable";
import { TableColumn } from "@/types/table.types";
import { Product } from "@/types/products";
import { PencilLine, Trash2, Plus, ChevronDown } from "lucide-react";
import SearchBar from "@/components/Shared/SearchBar";
import { toast } from "sonner";
import { ProductModal } from "./ProductModal";
import { Button } from "@/components/ui/button";

interface Props {
  initialData: Product[];
}

export default function ProductsTable({ initialData }: Props) {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [activeTab, setActiveTab] = useState<"All" | "Product list">("All"); // Default to All
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All"); 
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Debounce search to show skeleton effect
  useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => {
          setDebouncedQuery(searchQuery);
          // Small delay for skeleton visibility even if empty
          setTimeout(() => setIsLoading(false), 300);
      }, 500);
      
      return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  const filteredData = useMemo(() => {
    let data = products;
    
    // 1. Filter by Search (use debouncedQuery)
    if (debouncedQuery) {
        const query = debouncedQuery.toLowerCase();
        data = data.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.productId.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
    
    // 2. Filter by Category
    if (categoryFilter && categoryFilter !== "All") {
        data = data.filter(p => p.category === categoryFilter);
    }
    
    // If Active Tab is "Product list" we assume "All" is showing everything and "Product list" might imply a subset or just a different view context.
    // Based on user request "default select all, this time not show below filter button when select Product list then show filter dropdown button for data filter"
    // This implies filtering might be strictly tied to tab visual or specific logic. 
    // Here we treat them as view modes where 'Product list' enables the category dropdown.

    return data;
  }, [products, debouncedQuery, categoryFilter]);

  const handleSave = (product: Product) => {
      if (editingProduct) {
          // Edit
          setProducts(prev => prev.map(p => p.id === product.id ? product : p));
          toast.success("Product updated successfully!");
      } else {
          // Add
          setProducts(prev => [product, ...prev]);
          toast.success("Product added successfully!");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
  };

  const handleDelete = (row: Product) => {
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== row.id));
        toast.success("Product deleted successfully!");
      }, 500);
  };

  // Helper for category badge color
  const getCategoryBadgeStyle = (category: string) => {
    switch(category) {
        case 'Lipstick': return 'bg-[#4094F7] text-white'; 
        case 'Blush': return 'bg-[#89B374] text-white';  
        case 'Foundation': return 'bg-[#008F8F] text-white'; 
        case 'Eyeshadow': return 'bg-[#5C5C99] text-white'; 
        case 'Mascara': return 'bg-[#D68F5C] text-white';
        default: return 'bg-gray-200 text-gray-700';
    }
  };


  const columns: TableColumn<Product>[] = [
    {
      key: "productId",
      header: "Product ID",
      accessor: "productId",
      width: "15%",
    },
    {
      key: "name",
      header: "Product Name",
      accessor: "name",
      sortable: true,
      width: "20%",
    },
    {
      key: "stock",
      header: "Stock",
      accessor: "stock",
    },
    {
      key: "price",
      header: "Price",
      render: (_, row) => <span>${row.price.toFixed(2)}</span>,
      sortable: true,
    },
    {
        key: 'category',
        header: 'User type',
        render: (_, row) => (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeStyle(row.category)}`}>
                {row.category}
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
      icon: <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />,
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
                            setCategoryFilter("All"); // Reset filter on tab change likely?
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

            {/* Bottom Row: Filter & Search - Logic Updated */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 {/* Filter Dropdown - Only show if "Product list" tab is active */}
                 <div className="relative">
                    {activeTab === 'Product list' && (
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                                {categoryFilter === 'All' ? 'Filter By' : categoryFilter}
                                <ChevronDown size={16} />
                            </button>
                            {/* Simple Dropdown Logic */}
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block z-20">
                                {["All", "Lipstick", "Blush", "Foundation", "Eyeshadow", "Mascara"].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>

                 {/* Search */}
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Add button moved to right for desktop layout match? No, usually separate. 
                        Let's keep Add button in top row or next to search? 
                        Design image shows Add button is NOT in the filter row in previous generic designs, 
                        but let's Stick to the "All" tab view having search.
                     */}
                    <SearchBar 
                        placeholder="Search" 
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
          pagination={{ enabled: true, pageSize: 8 }}
          loading={isLoading}
          emptyMessage="Try adjusting your search or filters to find what you're looking for."
          className="border border-gray-100 shadow-sm rounded-b-2xl overflow-hidden"
          headerClassName="bg-primary text-white font-nunito"
          rowClassName="font-nunito"
        />

        {/* Add/Edit Modal */}
        <ProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            product={editingProduct}
        />
        
        {/* Floating Add Button for easier access if header is complex? 
            Or just keep it where it was? 
            The previous file had it in top row. I removed it from the specific div.
            Let's put it back in the top row right side.
        */}
    </>
  );
}
