import { ApiResponse } from "./auth.types";

export interface WithdrawalSummary {
  total_pending_amount: number;
  total_completed_amount: number;
  total_withdrawals: number;
  total_completed: number;
  total_rejected: number;
  total_pending: number;
  total_processing: number;
}

export interface WithdrawalPagination {
  total_records: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface Withdrawal {
  id: number;
  amount: number;
  status: "pending" | "processing" | "approved" | "rejected" | "completed";
  created_at?: string;
  creator_name?: string;
  creator_email?: string;
  transfer_id?: string;
  payout_id?: string;
  // Dynamic fields to handle whatever the backend sends for user details
  creator?: {
    id: string;
    full_name: string;
    email: string;
    profile_picture?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export interface WithdrawalsData {
  summary: WithdrawalSummary;
  pagination: WithdrawalPagination;
  pending_withdrawals: Withdrawal[]; // Might be empty or populated based on data
}

export type WithdrawalsResponse = ApiResponse<WithdrawalsData>;

export interface WithdrawalActionPayload {
  id: number;
  status: "approved" | "rejected";
}

export interface WithdrawalActionData {
  transfer_id?: string;
  payout_id?: string;
  status?: string;
}

export type WithdrawalActionResponse = ApiResponse<WithdrawalActionData | null>;
