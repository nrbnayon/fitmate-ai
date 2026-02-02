"use client";

import { useState, useEffect, useRef } from "react";
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
    productId: "",
    name: "",
    shade: "",
    stock: 0,
    price: 0,
    category: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        productId: `Lip-${Math.floor(Math.random() * 90) + 10}-abc`, // Auto-generate Display ID logic
        name: "",
        shade: "",
        stock: 0,
        price: 0,
        category: "",
        description: "",
        image: "",
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "price" || name === "stock") ? (parseFloat(value) || 0) : value,
    }));
    // Clear error on change
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
              setErrors(prev => ({ ...prev, image: "Image size must be less than 5MB" }));
              return;
          }
          
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, image: reader.result as string }));
              setErrors(prev => ({ ...prev, image: "" }));
          };
          reader.readAsDataURL(file);
      }
  };

  const validate = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) newErrors.name = "Product name is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
      if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
      // Optional: if (!formData.image) newErrors.image = "Cover image is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
          onSave(formData);
      }
  };

  const categories = ["Lipstick", "Foundation", "Blush", "Mascara", "Eyeshadow"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
                {product ? "Edit Product" : "Add Product"}
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
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                
                {formData.image ? (
                    <div className={`relative w-full md:w-64 h-40 rounded-lg overflow-hidden border ${errors.image ? 'border-red-500' : 'border-gray-200'} group`}>
                        <Image src={formData.image} alt="Cover" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: "" }))} 
                                className="bg-white text-red-500 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2"
                             >
                                 <Trash2 size={16} /> Remove
                             </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className={`w-full md:w-64 h-40 rounded-lg border border-dashed ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'} flex flex-col items-center justify-center cursor-pointer transition-colors`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className={`w-8 h-8 mb-2 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} />
                        <span className={`text-sm ${errors.image ? 'text-red-500' : 'text-gray-500'}`}>
                            {errors.image || "Click to upload image"}
                        </span>
                    </div>
                )}
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Category */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Category <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-500/20'} outline-none appearance-none bg-white font-nunito`}
                        >
                            <option value="" disabled>Select category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                    {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
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
                    <label className="text-sm font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-500/20'} outline-none font-nunito`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Price <span className="text-red-500">*</span></label>
                     <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-500/20'} outline-none font-nunito`}
                    />
                    {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                
                 {/* Stock */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Stock <span className="text-red-500">*</span></label>
                     <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.stock ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-pink-500/20'} outline-none font-nunito`}
                    />
                    {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                </div>

            </div>

             {/* Details */}
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Details</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter product description..."
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
                    className="bg-primary text-white hover:bg-primary/90 px-8"
                 >
                     Save
                 </Button>
            </div>

        </form>
      </div>
    </div>
  );
}
