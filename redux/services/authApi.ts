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
  ChangePasswordRequest,
  ChangePasswordApiResponse,
} from "@/types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. Login ──────────────────────────────────────────────────────────────
    login: builder.mutation<LoginApiResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),

    // ── 2. Forgot Password ────────────────────────────────────────────────────
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
    getProfile: builder.query<ProfileApiResponse, void>({
      query: () => ({
        url: "/auth/admin/profile/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // ── 8. Update Profile ────────────────────────────────────────────────────
    updateProfile: builder.mutation<ProfileApiResponse, FormData>({
      query: (formData) => ({
        url: "/auth/admin/profile/",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ── 9. Change Password ───────────────────────────────────────────────────
    changePassword: builder.mutation<ChangePasswordApiResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password/",
        method: "POST",
        body,
      }),
    }),
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
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
