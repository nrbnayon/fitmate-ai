"use client";

import Image from "next/image";
import { X, Calendar, Mail, ArrowUp, ArrowDown, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserDetailsQuery, useGetCreatorDetailsQuery } from "@/redux/services/userApi";

interface UserDetailsModalProps {
  userId: string | null;
  userRole: "user" | "creator" | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ userId, userRole, isOpen, onClose }: UserDetailsModalProps) {
  const isCreator = userRole === "creator";

  // Fetch data based on role
  const { 
    data: userDetailRes, 
    isLoading: isUserLoading 
  } = useGetUserDetailsQuery(userId!, { skip: !isOpen || !userId || isCreator });

  const { 
    data: creatorDetailRes, 
    isLoading: isCreatorLoading 
  } = useGetCreatorDetailsQuery(userId!, { skip: !isOpen || !userId || !isCreator });

  if (!isOpen) return null;

  const isLoading = isCreator ? isCreatorLoading : isUserLoading;
  const data = isCreator ? creatorDetailRes?.data : userDetailRes?.data;

  if (isLoading) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl h-[90vh] overflow-y-auto relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button Mobile */}
         <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 md:hidden p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>

        {/* Left Column: Profile & Info */}
        <div className="w-full md:w-[35%] lg:w-[30%] bg-white p-6 md:p-8 flex flex-col gap-8 border-r border-[#EAECF0]">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 relative border-4 border-white shadow-lg">
                    <Image
                        src={data.profile_picture || "/images/avatar.png"}
                        alt={data.full_name}
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold text-[#101828] mb-1">{data.full_name}</h2>
                <div className="flex flex-col gap-2 text-sm text-[#475467] items-center">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{data.email}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(data.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Content for Regular User: Previous Orders */}
            {!isCreator && "previous_orders" in data && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-[#101828] mb-4">Previous Orders</h3>
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {data.previous_orders.length > 0 ? (
                            data.previous_orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        ) : (
                             <p className="text-sm text-gray-400 italic">No previous orders.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Content for Creator: Recent Activity info maybe? Or nothing special here */}
        </div>


        {/* Right Column: Stats & Main View */}
        <div className="hidden md:flex flex-col w-full md:w-[65%] lg:w-[70%] bg-white p-6 md:p-8 overflow-hidden relative">
             <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                <X size={24} className="text-[#98A2B3]" />
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                 {isCreator && "total_earning" in data ? (
                    <>
                        <StatBox label="Total earning" value={`$${data.total_earning?.toLocaleString() || 0}`} isUp={true} trend="8%" />
                        <StatBox label="Total videos" value={data.total_videos?.toString() || "0"} />
                        <StatBox label="Total views" value={data.total_views?.toLocaleString() || "0"} isUp={true} trend="12%" />
                    </>
                 ) : !isCreator && "total_spending" in data ? (
                    <>
                        <StatBox label="Total spending" value={`$${data.total_spending?.toLocaleString() || 0}`} isUp={true} trend="15%" />
                        <StatBox label="Total orders" value={data.total_orders?.toString() || "0"} />
                        <StatBox label="Engagement" value="High" />
                    </>
                 ) : null}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {isCreator && "videos" in data ? (
                    <>
                        <h3 className="text-lg font-bold text-foreground mb-4">Videos Portfolio</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                            {data.videos?.map((vid) => (
                                <VideoCard key={vid.id} video={vid} />
                            ))}
                            {data.videos?.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No videos uploaded yet.</p>
                            )}
                        </div>
                    </>
                ) : !isCreator && "current_orders" in data ? (
                    <>
                        <h3 className="text-lg font-bold text-foreground mb-4">Current Active Orders</h3>
                        <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                            {data.current_orders?.length > 0 ? (
                                data.current_orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No active orders found.</p>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
             
             <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="text-foreground border-border" onClick={onClose}>Close Details</Button>
             </div>
        </div>

      </div>
    </div>
  );
}

function StatBox({ label, value, isUp, trend }: { label: string; value: string; isUp?: boolean; trend?: string }) {
    return (
        <div className="bg-white border border-[#EAECF0] rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">{label}</p>
            <h4 className="text-2xl font-bold text-foreground mb-2">{value}</h4>
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
            {!trend && <span className="text-xs text-[#475467]">Last 30 days</span>}
        </div>
    )
}

function OrderCard({ order }: { order: import("@/types/userManagement.types").UserOrder }) {
    const firstItem = order.items?.[0];
    
    return (
        <div className="flex items-center justify-between p-4 border border-[#EAECF0] rounded-2xl hover:bg-gray-50 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-pink-50 rounded-xl overflow-hidden shrink-0 relative border border-pink-100">
                     <Image
                        src={firstItem?.product_image || "/images/product.png"}
                        alt={firstItem?.product_name || "Product"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-[#101828]">{firstItem?.product_name || `Order #${order.id}`}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-secondary font-medium">{firstItem?.shade || "Default"}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: firstItem?.colour_hex || '#000' }} />
                        <span className="text-xs text-[#475467]">| Qty: {firstItem?.quantity || 1}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-primary">${order.total_amount}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${order.is_paid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {order.status}
                </span>
            </div>
        </div>
    )
}

function VideoCard({ video }: { video: import("@/types/userManagement.types").CreatorVideo }) {
    return (
        <div className="flex flex-col p-3 border border-[#EAECF0] rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-3">
                <Image
                    src={video.product_image || "/images/product.png"}
                    alt={video.product_name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white">
                    {new Date(video.created_at).toLocaleDateString()}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-[#101828] line-clamp-1">{video.product_name}</p>
                    <p className="text-xs text-secondary">Original Product Content</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <PlayCircle className="w-5 h-5 text-primary" />
                </Button>
            </div>
        </div>
    )
}
