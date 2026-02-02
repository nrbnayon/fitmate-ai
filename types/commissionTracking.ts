export type PayoutStatus = "paid" | "pending";

export interface CommissionTracking {
  id: string;
  creator: string;
  date: string;
  totalSales: string;
  commission: string;
  status: PayoutStatus;
}
