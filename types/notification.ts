// types/notification.ts
export type NotificationType = 
  | "driver_assigned" 
  | "parcel_delivered" 
  | "parcel_picked_up"
  | "parcel_in_transit"
  | "parcel_out_for_delivery"
  | "parcel_cancelled"
  | "parcel_returned"
  | "payment_received"
  | "new_order"
  | "delivery_delayed"
  | "driver_location_off"
  | "delivery_request_rejected"
  | "delivery_request_accepted"
  | "emergency_alert"
  | "driver_status_changed"
  | "seller_verified"
  | "seller_suspended";

export type NotificationStatus = "read" | "unread";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  tracking_no?: string;
  parcel_id?: string;
  driver_id?: string;
  driver_name?: string;
  seller_id?: string;
  seller_name?: string;
  timestamp: string;
  status: NotificationStatus;
  priority?: NotificationPriority;
  action_url?: string;
  metadata?: Record<string, any>;
}