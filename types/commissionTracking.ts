export type PayoutStatus = "Paid" | "Pending";

export interface Commission {
  creator: string;
  date: string;
  total_sales: string;
  commission: string;
  progress: PayoutStatus;
}

export interface CommissionTrackingResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    summary: {
      pending_payouts: number;
      paid_payouts: number;
      total_withdraw?: number; // Added based on different response examples
    };
    table: {
      total: number;
      page: number;
      total_pages: number;
      next: string | null;
      previous: string | null;
      commissions: Commission[];
    };
  };
}
