"use client";

import { useMemo, useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"All" | "Product list">("Product list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Lipstick"); // Default to Lipstick based on image
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredData = useMemo(() => {
    let data = products;
    
    // 1. Filter by Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );
    }
    
    // 2. Filter by Category (Simulated by the 'Lipstick' dropdown in image)
    // Note: The design shows "All" and "Product list" tabs. 
    // If "Product list" is active, maybe we show all? Or maybe "Lipstick" is a sub-filter.
    // For now, let's assume "Lipstick" button filters by "Lipstick".
    if (categoryFilter && categoryFilter !== "All") {
        data = data.filter(p => p.category === categoryFilter);
    }

    return data;
  }, [products, searchQuery, categoryFilter]);

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
      // The DynamicTable confirmation config handles the UI confirm.
      // This function executes AFTER confirmation if `requiresConfirmation` is set in actions config?
      // Actually DynamicTable's `onClick` fires directly if `requiresConfirmation` is missing, 
      // or if it's there logic is handled inside DynamicTable but we need to pass the handler to the `action` config.
      // Let's verify DynamicTable implementation. 
      // Yes, if `requiresConfirmation` is true, DynamicTable shows modal, then calls `action.onClick`.
      
      // Simulate API deletion
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== row.id));
        toast.success("Product deleted successfully!");
      }, 500);
  };


  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      accessor: "name",
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
      render: (_, row) => <span>${row.price.toFixed(2)}</span>,
      sortable: true,
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <PencilLine className="w-5 h-5 text-secondary hover:text-foreground transition-colors cursor-pointer" />,
      onClick: (row: Product) => {
          setEditingProduct(row);
          setIsModalOpen(true);
      },
      show: () => true,
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-5 h-5 text-red-400 hover:text-red-500 transition-colors cursor-pointer" />,
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
                        onClick={() => setActiveTab("All")}
                        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'All' ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setActiveTab("Product list")}
                        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Product list' ? 'bg-[#C14A7A] text-white shadow-md' : 'text-secondary hover:bg-gray-50'}`}
                    >
                        Product list
                    </button>
                </div>

                <Button 
                    onClick={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-[#C14A7A] hover:bg-[#A03D65] text-white gap-2 px-6"
                >
                    <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                        <Plus size={12} strokeWidth={3} />
                    </div>
                    Add
                </Button>
            </div>

            {/* Bottom Row: Filter & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 {/* Filter Dropdown (Simulated) */}
                 <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C14A7A] text-white rounded-lg text-sm font-medium">
                        {categoryFilter}
                        <ChevronDown size={16} />
                    </button>
                    {/* Real implementation would have a dropdown menu here */}
                 </div>

                 {/* Search */}
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
          className="border border-gray-100 shadow-sm rounded-b-2xl overflow-hidden"
          headerClassName="bg-[#C14A7A] text-white font-nunito"
          rowClassName="font-nunito"
        />

        {/* Add/Edit Modal */}
        <ProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            product={editingProduct}
        />
    </>
  );
}
