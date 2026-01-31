"use client";

import { useMemo } from "react";
import Image from "next/image";
import { X, Calendar, MapPin, Mail, Phone, ArrowUp, ArrowDown, Trash2 } from "lucide-react"; // Import Lucide icons
import { User, Order } from "@/types/users";
import { Button } from "@/components/ui/button";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const isCreator = user.role === 'creator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl h-[90vh] overflow-y-auto relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button Mobile */}
         <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 md:hidden p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>

        {/* Left Column: Profile & Info */}
        <div className="w-full md:w-[35%] lg:w-[30%] bg-white p-6 md:p-8 flex flex-col gap-8 border-r border-[#EAECF0]">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 relative border-4 border-white shadow-lg">
                    <Image
                        src={user.image || "/images/avatar.png"}
                        alt={user.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold text-[#101828] mb-1">{user.name}</h2>
                <div className="flex flex-col gap-2 text-sm text-[#475467] items-center">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location || "N/A"}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{user.date || "N/A"}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone || "N/A"}</span>
                    </div>
                </div>
            </div>

            {/* Previous Orders Section */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-[#101828] mb-4">Previous Orders</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {user.previousOrders && user.previousOrders.length > 0 ? (
                        user.previousOrders.map((order, idx) => (
                            <OrderCard key={idx} order={order} />
                        ))
                    ) : (
                         <p className="text-sm text-gray-500 italic">No previous orders found.</p>
                    )}
                </div>
            </div>
        </div>


        {/* Right Column: Stats & Active/Details */}
        <div className="hidden md:flex flex-col w-full md:w-[65%] lg:w-[70%] bg-white p-6 md:p-8 overflow-hidden relative">
             <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                <X size={24} className="text-[#98A2B3]" />
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pr-8">
                 {isCreator ? (
                    <>
                        <StatBox label="Total earning" value={`$${user.totalEarnings?.toLocaleString() || 0}`} isUp={true} trend="40%" />
                        <StatBox label="Total orders" value={user.totalOrders?.toString() || "0"} isUp={false} trend="40%" />
                        <StatBox label="Total reviews" value={user.totalReviews?.toString() || "0"} />
                        <StatBox label="Withdraws" value={`$${user.withdraws?.toLocaleString() || 0}`} isUp={false} trend="40%" />
                    </>
                 ) : (
                    <>
                        <StatBox label="Total spending" value={`$${user.totalSpending?.toLocaleString() || 0}`} isUp={true} trend="40%" />
                        <StatBox label="Total orders" value={user.totalOrders?.toString() || "0"} isUp={false} trend="40%" />
                    </>
                 )}
            </div>

            {/* Active Orders Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-4">Active Orders</h3>
                 <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                    {user.activeOrders && user.activeOrders.length > 0 ? (
                        user.activeOrders.map((order, idx) => (
                            <OrderCard key={idx} order={order} />
                        ))
                    ) : (
                         <p className="text-sm text-gray-500 italic">No active orders found.</p>
                    )}
                </div>
            </div>
             {/* Pagination/Next dummy for look */}
             <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="text-foreground border-border">Next &rarr;</Button>
             </div>
        </div>

      </div>
    </div>
  );
}

function StatBox({ label, value, isUp, trend }: { label: string; value: string; isUp?: boolean; trend?: string }) {
    return (
        <div className="bg-white border border-[#EAECF0] rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
            <h4 className="text-3xl font-bold text-foreground mb-2">{value}</h4>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-medium">
                     {isUp ? (
                         <ArrowUp className="w-3 h-3 text-green-500" />
                     ) : (
                         <ArrowDown className="w-3 h-3 text-red-500" />
                     )}
                     <span className={isUp ? "text-green-500" : "text-red-500"}>{trend}</span>
                     <span className="text-[#475467] ml-1">vs last month</span>
                </div>
            )}
            {!trend && <span className="text-xs text-[#475467]">From last month</span>}
        </div>
    )
}

function OrderCard({ order, showActions = false }: { order: Order; showActions?: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 border border-[#EAECF0] rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-lg overflow-hidden shrink-0 relative">
                     <Image
                        src={order.image || "/images/product.png"}
                        alt={order.productName}
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground">{order.productName}</p>
                    <p className="text-xs text-secondary">{order.variant}</p>
                </div>
            </div>
             {showActions && (
                 <button className="text-secondary hover:text-red-500 transition-colors p-2">
                     <Trash2 className="w-4 h-4" />
                 </button>
             )}
        </div>
    )
}
