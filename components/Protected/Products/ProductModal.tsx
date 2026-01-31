"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Image as ImageIcon, Trash2, ChevronDown } from "lucide-react";
import { Product } from "@/types/products";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    shade: "",
    price: 0,
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        shade: "",
        price: 0,
        category: "",
        description: "",
        image: "",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
  };

  const categories = ["Lipstick", "Foundation", "Blush", "Mascara", "Eyeshadow"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
                {product ? "Edit" : "Add"}
            </div>
             <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
                <X size={20} className="text-gray-500" />
            </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Upload Cover</label>
                {formData.image ? (
                    <div className="relative w-full md:w-64 h-40 rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src={formData.image || "/images/placeholder.png"} alt="Cover" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: "" }))} 
                                className="bg-white text-red-500 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2"
                             >
                                 <Trash2 size={16} /> Delete
                             </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="w-full md:w-64 h-40 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                            // Simulate upload
                            setFormData(prev => ({ ...prev, image: "/images/product.png" }))
                        }}
                    >
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add image</span>
                    </div>
                )}
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Category */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 appearance-none bg-white font-nunito"
                        >
                            <option value="" disabled>Select category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                </div>

                {/* Shade */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Shade</label>
                    <input
                        type="text"
                        name="shade"
                        value={formData.shade}
                        onChange={handleChange}
                        placeholder="e.g Peachy Blush"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-nunito"
                    />
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="write here"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-nunito"
                    />
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Price</label>
                     <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="write here"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-nunito"
                    />
                </div>

            </div>

             {/* Details */}
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Detailes</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="write here"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 resize-none font-nunito"
                />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                 <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-300 text-gray-700 px-6"
                 >
                     Cancel
                 </Button>
                 <Button
                    type="submit"
                    className="bg-gray-800 text-white hover:bg-gray-900 px-8"
                 >
                     Save
                 </Button>
            </div>

        </form>
      </div>
    </div>
  );
}
