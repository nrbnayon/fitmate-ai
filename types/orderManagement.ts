export type OrderStatus = "paid" | "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: number;
  user: string;
  full_name: string;
  mobile_number: string;
  emirate: string;
  area: string;
  building_name: string;
  apartment_no: string;
  landmark: string;
  delivery_method: string;
  delivery_charge: string;
  delivery_note: string;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
}

export interface OrderListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    total: number;
    page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    orders: Order[];
  };
}

export interface SingleOrderResponse {
  success: boolean;
  status: number;
  message: string;
  data: Order;
}
