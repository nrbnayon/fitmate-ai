import { ApiResponse } from "./auth.types";

export interface PaymentHistory {
  payment_id: string;
  customer: string;
  created_at: string;
  amount: string;
  transaction_method: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: PaymentHistory[];
  };
}

export type SinglePaymentResponse = ApiResponse<PaymentHistory>;
