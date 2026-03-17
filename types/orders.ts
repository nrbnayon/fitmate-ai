import { ApiResponse } from "./auth.types";

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
  payment_method: string;
  items: OrderItem[];
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: ProductBrief;
  quantity: number;
  price: string;
}

export interface ProductBrief {
  id: number;
  title: string;
  price: number;
  image: string | null;
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

export type SingleOrderResponse = ApiResponse<Order>;
