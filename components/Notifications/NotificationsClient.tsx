"use client";

import { useState, useMemo } from "react";
import { useUser } from "@/hooks/useUser";
import { allNotificationsData } from "@/data/allNotificationsData";
import { Notification, NotificationType } from "@/types/notification";
import {
    Bell,
    Package,
    Truck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    UserCheck,
    UserPlus,
    AlertOctagon,
    Clock,
    X,
    ExternalLink,
    Calendar,
    MapPin,
    User,
    Hash,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Shared/Pagination";

const NOTIFICATION_ICONS: Record<string, any> = {
    driver_assigned: Truck,
    parcel_delivered: CheckCircle2,
    parcel_picked_up: Package,
    delivery_request_accepted: CheckCircle2,
    delivery_request_rejected: XCircle,
    driver_location_off: AlertTriangle,
    emergency_alert: AlertOctagon,
    seller_verified: UserCheck,
    seller_suspended: XCircle,
    new_order: UserPlus,
    default: Bell
};

const PRIORITY_COLORS: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200"
};

export default function NotificationsClient() {
    const { role, isLoading: userLoading } = useUser();
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [notifications, setNotifications] = useState(allNotificationsData);
    const itemsPerPage = 8;

    const filteredNotifications = useMemo(() => {
        if (!role) return [];

        // Filter based on role
        let roleNotifications = notifications;

        if (role === "seller_admin") {
            const sellerTypes: NotificationType[] = [
                "parcel_delivered",
                "driver_assigned",
                "parcel_picked_up",
                "payment_received",
                "new_order"
            ];
            roleNotifications = notifications.filter(n => sellerTypes.includes(n.type));
        } else if (role === "super_admin") {
            const superAdminTypes: NotificationType[] = [
                "driver_location_off",
                "delivery_request_rejected",
                "emergency_alert",
                "seller_verified",
                "seller_suspended",
                "delivery_request_accepted",
                "parcel_delivered"
            ];
            roleNotifications = notifications.filter(n => superAdminTypes.includes(n.type));
        }

        // Filter based on tab
        if (activeTab === "unread") {
            roleNotifications = roleNotifications.filter(n => n.status === "unread");
        }

        return roleNotifications;
    }, [role, activeTab, notifications]);

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

    const getIcon = (type: string) => {
        const Icon = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.default;
        return <Icon className="w-5 h-5" />;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            weekday: 'long',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatFullTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);

        // Mark as read if unread
        if (notification.status === "unread") {
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notification.id
                        ? { ...n, status: "read" as const }
                        : n
                )
            );
        }
    };

    const closeModal = () => {
        setSelectedNotification(null);
    };

    const handleActionClick = (url?: string) => {
        if (url) {
            window.location.href = url;
        }
        closeModal();
    };

    if (userLoading) {
        return (
            <div className="p-8 flex justify-center">
                <Clock className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            <div className="bg-white rounded-3xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50 p-6 md:p-8">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-8">
                    <button
                        onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative min-w-fit cursor-pointer",
                            activeTab === "all" ? "text-primary" : "text-gray-400 hover:text-secondary"
                        )}
                    >
                        All
                        {activeTab === "all" && <div className="absolute -bottom-px left-0 w-full h-[3px] bg-primary rounded-full" />}
                    </button>
                    <button
                        onClick={() => { setActiveTab("unread"); setCurrentPage(1); }}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative min-w-fit cursor-pointer",
                            activeTab === "unread" ? "text-primary" : "text-gray-400 hover:text-secondary"
                        )}
                    >
                        Unread
                        {activeTab === "unread" && <div className="absolute -bottom-px left-0 w-full h-[3px] bg-primary rounded-full" />}
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4 mb-8">
                    {currentData.length > 0 ? (
                        currentData.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all flex items-start gap-4 hover:shadow-md group cursor-pointer",
                                    notification.status === "unread"
                                        ? "bg-blue-50/30 border-blue-100/50"
                                        : "bg-white border-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                    notification.status === "unread" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                        <h3 className="text-sm font-bold text-foreground">
                                            {notification.title}
                                            {notification.tracking_no && (
                                                <span className="ml-2 text-primary font-medium">#{notification.tracking_no}</span>
                                            )}
                                        </h3>
                                        <span className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-wider">
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-gray-500 line-clamp-2 md:line-clamp-none">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-secondary">
                            <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="font-bold">No notifications found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredNotifications.length}
                        itemsPerPage={itemsPerPage}
                        currentItemsCount={currentData.length}
                    />
                )}
            </div>


            {/* Notification Details Modal */}
            {selectedNotification && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-6 border-b border-gray-100">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-secondary" />
                            </button>

                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
                                    "bg-primary text-white"
                                )}>
                                    {getIcon(selectedNotification.type)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-1">
                                        {selectedNotification.title}
                                    </h2>
                                    {selectedNotification.priority && (
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                                            PRIORITY_COLORS[selectedNotification.priority]
                                        )}>
                                            {selectedNotification.priority.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Timestamp */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                <Calendar className="w-4 h-4" />
                                <span>{formatFullTimestamp(selectedNotification.timestamp)}</span>
                            </div>

                            {/* Message */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                    {selectedNotification.message}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                {selectedNotification.tracking_no && (
                                    <div className="flex items-start gap-3">
                                        <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 mb-1">Tracking Number</p>
                                            <p className="text-sm font-bold text-primary">{selectedNotification.tracking_no}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedNotification.driver_name && (
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 mb-1">Driver</p>
                                            <p className="text-sm font-medium text-foreground">{selectedNotification.driver_name}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedNotification.seller_name && (
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 mb-1">Seller</p>
                                            <p className="text-sm font-medium text-foreground">{selectedNotification.seller_name}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 mb-2">Additional Details</p>
                                            <div className="space-y-2">
                                                {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500 capitalize">
                                                            {key.replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className="text-xs font-medium text-foreground">
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            {/* {selectedNotification.action_url && (
                                <button
                                    onClick={() => handleActionClick(selectedNotification.action_url)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    View Details
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}