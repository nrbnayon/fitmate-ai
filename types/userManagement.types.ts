// types/userManagement.types.ts
import { ApiResponse } from "./auth.types";

/**
 * ─── 1. User List ────────────────────────────────────────────────────────────
 * GET {{base_url}}/auth/users/?page=1&page_size=10&search=...
 */
export interface UserListItem {
    id: string;
    full_name: string;
    email: string;
    creator: boolean;
    profile_picture: string | null;
    created_at: string;
}

export interface PaginatedData<T> {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export type UserListResponse = ApiResponse<PaginatedData<UserListItem>>;

/**
 * ─── 2. User Details ──────────────────────────────────────────────────────────
 * GET {{base_url}}/auth/users/:uuid/
 */
export interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    shade: string;
    colour_hex: string;
    quantity: number;
    price: string;
}

export interface UserOrder {
    id: number;
    mobile_number: string;
    emirate: string;
    area: string;
    building_name: string;
    apartment_no: string;
    total_amount: string;
    status: string;
    is_paid: boolean;
    created_at: string;
    items: OrderItem[];
}

export interface UserDetailsData {
    id: string;
    full_name: string;
    email: string;
    profile_picture: string | null;
    created_at: string;
    total_spending: number;
    total_orders: number;
    current_orders: UserOrder[];
    previous_orders: UserOrder[];
}

export type UserDetailsResponse = ApiResponse<UserDetailsData>;

/**
 * ─── 3. Creator List ──────────────────────────────────────────────────────────
 * GET user-creator-list
 */
export interface CreatorListItem {
    id: string;
    full_name: string;
    email: string;
    creator: boolean;
    profile_picture: string | null;
    created_at: string;
}

export type CreatorListResponse = ApiResponse<PaginatedData<CreatorListItem>>;

/**
 * ─── 4. Creator Details ───────────────────────────────────────────────────────
 * GET {{base_url}}/auth/users-creators/:uuid/
 */
export interface CreatorVideo {
    id: number;
    video_url: string;
    product_name: string;
    product_image: string;
    created_at: string;
}

export interface CreatorDetailsData {
    id: string;
    full_name: string;
    email: string;
    profile_picture: string | null;
    created_at: string;
    total_views: number;
    total_videos: number;
    total_earning: number;
    total_orders: number;
    videos: CreatorVideo[];
}

export type CreatorDetailsResponse = ApiResponse<CreatorDetailsData>;

/**
 * ─── 5. Delete User ──────────────────────────────────────────────────────────
 * DELETE {{url}}/auth/users/:uuid
 */
export interface DeleteUserResponse {
    message: string;
}
