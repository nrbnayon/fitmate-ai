// types/auth.types.ts (strictly typed against actual API responses updated)
// ─── Strictly typed against actual API responses ──────────────────────────────

export type UserRole = "admin" | "user" | "guest" | "creator";

// ─── Generic API wrapper (all endpoints follow this shape) ───────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: Record<string, unknown>;
  error_code?: string;
}

// ─── 1. Login ─────────────────────────────────────────────────────────────────
// POST /auth/login/
// Body: { email, password }
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  access_token_valid_till: number; // Unix ms timestamp
  expires_at?: number;
  refresh_token: string;
  role: UserRole;
  user_id: string;
}

export type LoginApiResponse = ApiResponse<LoginResponseData>;

// ─── 2. Forgot Password ───────────────────────────────────────────────────────
// POST /auth/forgot-password/
// Body: { email }
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponseData {
  user_id: string;
  expires_at?: number; // Unix ms timestamp
}

export type ForgotPasswordApiResponse = ApiResponse<ForgotPasswordResponseData>;

// ─── 3. Verify Reset Code ─────────────────────────────────────────────────────
// POST /auth/verify-reset-code/
// Body: { user_id, code }
export interface VerifyResetCodeRequest {
  user_id: string;
  code: string; // API uses "code" not "verification_code"
}

export interface VerifyResetCodeResponseData {
  secret_key: string;
  user_id: string;
}

export type VerifyResetCodeApiResponse =
  ApiResponse<VerifyResetCodeResponseData>;

// ─── 4. Reset Password ────────────────────────────────────────────────────────
// POST /auth/reset-password/
// Body: { secret_key, user_id, new_password, confirm_password }
export interface ResetPasswordRequest {
  secret_key: string;
  user_id: string;
  new_password: string;
  confirm_password: string;
}

export type ResetPasswordApiResponse = ApiResponse<null>;

// ─── 5. Resend Verification Code ──────────────────────────────────────────────
// POST /auth/resend-verification/
// Body: { email }  ← API uses "email"
export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponseData {
  email: string;
  expires_at?: number; // Unix ms timestamp
}

export type ResendOtpApiResponse = ApiResponse<ResendOtpResponseData>;

// ─── 6. Refresh Token ─────────────────────────────────────────────────────────
// GET /auth/refresh-token/  (Bearer Token in header)
// Body: { refresh: string }
export interface RefreshTokenRequest {
  refresh: string; // API uses "refresh" not "refresh_token"
}

export interface RefreshTokenResponseData {
  access_token: string;
  refresh_token: string;
}

export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponseData>;

// ─── 7. Get Profile / Me ──────────────────────────────────────────────────────
// GET /auth/admin/profile/  (Bearer Token in header)
export interface ProfileResponseData {
  full_name: string;
  email: string;
  profile_picture: string | null;
  phone_number: string | null;
  address: string | null;
  created_at: string; // ISO date string
}

export type ProfileApiResponse = ApiResponse<ProfileResponseData>;

// ─── Auth State (Redux slice shape) ──────────────────────────────────────────
export interface AuthUser {
  user_id: string;
  role: UserRole;
  full_name?: string;
  email?: string;
  profile_picture?: string | null;
  phone_number?: string | null;
  address?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── 8. Change Password ───────────────────────────────────────────────────────
// POST /auth/change-password/
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export type ChangePasswordApiResponse = ApiResponse<null>;
