export type UserRole = "admin" | "user" | "guest" | "creator";

// ─── Generic API Response ────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: number;
  message: string;
  data?: T;
  errors?: Record<string, unknown>;
  error_code?: string;
}

// ─── Auth Tokens ─────────────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

// ─── 1. Login / Sign-In ──────────────────────────────────────────────────────
export interface LoginRequest {
  email_address: string;
  password: string;
}

export interface LoginUser {
  id: string;
  email_address: string;
  full_name: string;
  role: UserRole;
}

export interface LoginResponse {
  user: LoginUser;
  tokens: AuthTokens;
}

// ─── 2. Forgot Password ───────────────────────────────────────────────────────
export interface ForgotPasswordRequest {
  email_address: string;
}

export interface ForgotPasswordResponse {
  message: string;
  user_id: string;
}

// ─── 3. Verify Reset Code ─────────────────────────────────────────────────────
export interface VerifyResetCodeRequest {
  user_id: string;
  verification_code: string;
}

export interface VerifyResetCodeResponse {
  message: string;
  secret_key: string;
}

// ─── 4. Resend Verification Code ──────────────────────────────────────────────
export interface ResendOtpRequest {
  user_id: string;
}

export interface ResendOtpResponse {
  message: string;
}

// ─── 5. Reset Password ────────────────────────────────────────────────────────
export interface ResetPasswordRequest {
  user_id: string;
  secret_key: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ─── 6. Refresh Token ─────────────────────────────────────────────────────────
export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  message: string;
  access_token: string;
  expires_in: number;
  expires_at: number;
}

// ─── 7. Profile / Get Me ──────────────────────────────────────────────────────
export interface ProfileResponse {
  id: string;
  full_name: string;
  email_address: string;
  phone_number?: string;
  avatar?: string;
  location?: string;
  role: UserRole;
}

// ─── Change Password ──────────────────────────────────────────────────────────
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ─── Legacy / kept for compatibility ─────────────────────────────────────────
export interface VerifyEmailRequest {
  email_address: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VerifyEmailResponse extends Record<string, unknown> {}
