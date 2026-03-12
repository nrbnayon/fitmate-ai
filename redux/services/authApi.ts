// redux/services/authApi.ts
// All auth endpoints injected into the root apiSlice.
// URLs and body field names match the real API exactly.

import { apiSlice } from "../features/apiSlice";
import type {
  LoginRequest,
  LoginApiResponse,
  ForgotPasswordRequest,
  ForgotPasswordApiResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeApiResponse,
  ResetPasswordRequest,
  ResetPasswordApiResponse,
  ResendOtpRequest,
  ResendOtpApiResponse,
  RefreshTokenRequest,
  RefreshTokenApiResponse,
  ProfileApiResponse,
} from "@/types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. Login ──────────────────────────────────────────────────────────────
    // POST /auth/login/
    // Body: { email, password }
    // Response data: { access_token, access_token_valid_till, refresh_token, role, user_id }
    login: builder.mutation<LoginApiResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),

    // ── 2. Forgot Password ────────────────────────────────────────────────────
    // POST /auth/forgot-password/
    // Body: { email }
    // Response data: { user_id, expires_at }
    forgotPassword: builder.mutation<
      ForgotPasswordApiResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password/",
        method: "POST",
        body,
      }),
    }),

    // ── 3. Verify Reset Code ──────────────────────────────────────────────────
    // POST /auth/verify-reset-code/
    // Body: { user_id, code }   ← field is "code" not "verification_code"
    // Response data: { secret_key, user_id }
    verifyResetCode: builder.mutation<
      VerifyResetCodeApiResponse,
      VerifyResetCodeRequest
    >({
      query: (body) => ({
        url: "/auth/verify-reset-code/",
        method: "POST",
        body,
      }),
    }),

    // ── 4. Reset Password ─────────────────────────────────────────────────────
    // POST /auth/reset-password/
    // Body: { secret_key, user_id, new_password, confirm_password }
    // Response: message only, no data
    resetPassword: builder.mutation<
      ResetPasswordApiResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/reset-password/",
        method: "POST",
        body,
      }),
    }),

    // ── 5. Resend Verification Code ───────────────────────────────────────────
    // POST /auth/resend-verification/
    // Body: { email }   ← field is "email" not "user_id"
    // Response data: { email, expires_at }
    resendVerificationCode: builder.mutation<
      ResendOtpApiResponse,
      ResendOtpRequest
    >({
      query: (body) => ({
        url: "/auth/resend-verification/",
        method: "POST",
        body,
      }),
    }),

    // ── 6. Refresh Token ──────────────────────────────────────────────────────
    // GET /auth/refresh-token/  — Bearer Token (refresh token) in Authorization header
    // Body: { refresh }   ← field is "refresh" not "refresh_token"
    // Response data: { access_token }
    // NOTE: This is handled automatically by baseQueryWithReauth in apiSlice.ts.
    //       Exposed here only if you need to call it manually.
    refreshToken: builder.mutation<
      RefreshTokenApiResponse,
      RefreshTokenRequest
    >({
      query: (body) => ({
        url: "/auth/refresh-token/",
        method: "GET",
        body,
      }),
    }),

    // ── 7. Get Profile ────────────────────────────────────────────────────────
    // GET /auth/admin/profile/  — Bearer Token in Authorization header
    // Response data: { full_name, email, profile_picture, phone_number, address, created_at }
    getProfile: builder.query<ProfileApiResponse, void>({
      query: () => ({
        url: "/auth/admin/profile/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    //  // ── 8. Update Profile ────────────────────────────────────────────────────
    // updateProfile: builder.mutation<ApiResponse<ProfileResponse>, FormData>({
    //   query: (formData) => ({
    //     url: "/api/settings/personal-info/me",
    //     method: "PUT",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Profile"],
    // }),

    // // ── 9. Change Password ───────────────────────────────────────────────────
    // changePassword: builder.mutation<ApiResponse<any>, ChangePasswordRequest>({
    //   query: (data) => ({
    //     url: "/api/auth/change-password",
    //     method: "PATCH",
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useResendVerificationCodeMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi;
