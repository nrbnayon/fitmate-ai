
// data/allNotificationsData.ts

import { Notification } from "@/types/notification";

export const allNotificationsData: Notification[] = [
  {
    id: "11",
    type: "driver_assigned",
    title: "Driver assigned for your parcel",
    message: "John Doe has assigned to deliver the parcel to deliver. Track Your parcel here.",
    tracking_no: "TRK176725527",
    parcel_id: "PCL011",
    timestamp: "2026-01-13T14:00:00Z",
    status: "unread",
    priority: "medium"
  },
  {
    id: "12",
    type: "parcel_delivered",
    title: "Parcel Delivered",
    message: "Your parcel has been delivered to the customer.",
    tracking_no: "TRK176725528",
    parcel_id: "PCL012",
    timestamp: "2026-01-13T14:00:00Z",
    status: "unread",
    priority: "low"
  },
  {
    id: "13",
    type: "driver_assigned",
    title: "Driver assigned for your parcel",
    message: "John Doe has assigned to deliver the parcel to deliver. Track Your parcel here.",
    tracking_no: "TRK176725527",
    parcel_id: "PCL011",
    timestamp: "2026-01-13T14:00:00Z",
    status: "read",
    priority: "medium"
  },
  {
    id: "14",
    type: "parcel_delivered",
    title: "Parcel Delivered",
    message: "Your parcel has been delivered to the customer.",
    tracking_no: "TRK176725528",
    parcel_id: "PCL012",
    timestamp: "2026-01-13T14:00:00Z",
    status: "read",
    priority: "low"
  },
  {
    id: "1",
    type: "driver_location_off",
    title: "Driver location off",
    message: "Sarah Johnson has turned off their location.",
    driver_id: "DRV001",
    driver_name: "Sarah Johnson",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "medium",
    action_url: "/drivers/DRV001",
    metadata: {
      vehicle_number: "DH-1234",
      last_known_location: "Mohakhali, Dhaka"
    }
  },
  {
    id: "2",
    type: "delivery_request_rejected",
    title: "Delivery request rejected",
    message: "Sarah Johnson has rejected the parcel to deliver. Assign it to someone else.",
    tracking_no: "TRK176725527",
    parcel_id: "PCL011",
    driver_id: "DRV001",
    driver_name: "Sarah Johnson",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "high",
    action_url: "/parcels/PCL011",
    metadata: {
      rejection_reason: "Too far from current location",
      parcel_name: "Smart Watch"
    }
  },
  {
    id: "3",
    type: "emergency_alert",
    title: "Emergency Alert",
    message: "Michael Chen has send an emergency alert! Contact with him to see what went wrong!",
    driver_id: "DRV002",
    driver_name: "Michael Chen",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "urgent",
    action_url: "/drivers/DRV002",
    metadata: {
      alert_type: "emergency",
      driver_phone: "01489012345",
      current_location: "Uttara, Dhaka"
    }
  },
  {
    id: "4",
    type: "delivery_request_accepted",
    title: "Delivery request Accepted",
    message: "David Martinez has accepted the parcel to deliver. Track their location to see the progress.",
    tracking_no: "TRK176725527",
    parcel_id: "PCL011",
    driver_id: "DRV003",
    driver_name: "David Martinez",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "medium",
    action_url: "/parcels/PCL011",
    metadata: {
      vehicle_type: "car",
      vehicle_number: "DH-9012",
      estimated_pickup_time: "2026-01-12T15:00:00Z"
    }
  },
  {
    id: "5",
    type: "driver_location_off",
    title: "Driver location off",
    message: "Emily Rodriguez has turned off their location.",
    driver_id: "DRV004",
    driver_name: "Emily Rodriguez",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "medium",
    action_url: "/drivers/DRV004",
    metadata: {
      vehicle_number: "DH-3456",
      vehicle_type: "van",
      assigned_parcels: 1
    }
  },
  {
    id: "6",
    type: "delivery_request_rejected",
    title: "Delivery request rejected",
    message: "James Wilson has rejected the parcel to deliver. Assign it to someone else.",
    tracking_no: "TRK176725527",
    parcel_id: "PCL011",
    driver_id: "DRV005",
    driver_name: "James Wilson",
    timestamp: "2026-01-12T14:00:00Z",
    status: "unread",
    priority: "high",
    action_url: "/parcels/PCL011",
    metadata: {
      rejection_reason: "Vehicle maintenance required",
      vehicle_number: "DH-7890"
    }
  },
  {
    id: "7",
    type: "driver_location_off",
    title: "Driver location off",
    message: "Sophia Anderson has turned off their location.",
    driver_id: "DRV006",
    driver_name: "Sophia Anderson",
    timestamp: "2026-01-12T14:00:00Z",
    status: "read",
    priority: "medium",
    action_url: "/drivers/DRV006",
    metadata: {
      vehicle_number: "DH-2345",
      last_active: "2026-01-12T13:45:00Z"
    }
  },
  {
    id: "8",
    type: "seller_verified",
    title: "New Seller Verified",
    message: "Home Decor has been successfully verified and can now start accepting orders.",
    seller_id: "SLR006",
    seller_name: "Home Decor",
    timestamp: "2026-01-12T13:30:00Z",
    status: "read",
    priority: "low",
    action_url: "/sellers/SLR006",
    metadata: {
      business_category: "retail",
      seller_email: "emma@homedecor.com"
    }
  },
  {
    id: "9",
    type: "seller_suspended",
    title: "Seller Account Suspended",
    message: "Tech Solutions account has been suspended due to policy violations.",
    seller_id: "SLR010",
    seller_name: "Tech Solutions",
    timestamp: "2026-01-12T12:00:00Z",
    status: "read",
    priority: "high",
    action_url: "/sellers/SLR010",
    metadata: {
      suspension_reason: "Multiple customer complaints",
      business_name: "Tech Solutions"
    }
  },
  {
    id: "10",
    type: "parcel_delivered",
    title: "Parcel Delivered",
    message: "Parcel has been successfully delivered to the customer at Dhanmondi, Dhaka.",
    tracking_no: "TRK176725529",
    parcel_id: "PCL013",
    driver_id: "DRV002",
    driver_name: "James Bond",
    timestamp: "2026-01-12T11:30:00Z",
    status: "read",
    priority: "low",
    action_url: "/parcels/PCL013",
    metadata: {
      delivery_location: "Dhanmondi, Dhaka",
      receiver_name: "Michael Ray",
      parcel_name: "Wireless Mouse"
    }
  }
];