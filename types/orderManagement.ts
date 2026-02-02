export type OrderStatus = "delivered" | "pending" | "shipped";

export interface OrderManagement {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: string;
  productCount: number;
  status: OrderStatus;
}
