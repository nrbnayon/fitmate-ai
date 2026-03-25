"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ProductCategory } from "@/types/products";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/redux/services/productApi";
import { toast } from "sonner";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProductCategory | null;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (category) {
        await updateCategory({ id: category.id, payload: { name } }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory({ name }).unwrap();
        toast.success("Category created successfully!");
      }
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError.data?.message || "Failed to save category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-[#C14A7A] text-white">
          <h2 className="text-xl font-bold">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
              }}
              className={`w-full px-4 py-3 rounded-xl border ${
                error ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-[#C14A7A] focus:border-transparent outline-none transition-all`}
              placeholder="Enter category name"
              disabled={isLoading}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#C14A7A] text-white font-semibold rounded-xl hover:bg-[#A33E67] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                category ? "Update" : "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
