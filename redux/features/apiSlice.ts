// redux/features/apiSlice.ts
// Base RTK Query slice with:
//   - Cookie-based token storage (no localStorage)
//   - Auto token refresh on 401 with mutex guard
//   - Security-safe cookie attributes
//
// All auth endpoints inject into this slice via authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RefreshTokenApiResponse } from "@/types/auth.types";

// ─── Cookie helpers ───────────────────────────────────────────────────────────
// No js-cookie dependency — raw document.cookie only.
// Tokens are stored in cookies so Next.js middleware (proxy.ts) can read them
// server-side for route protection.

const IS_PROD = process.env.NODE_ENV === "production";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

export const setCookie = (
  name: string,
  value: string,
  expiresAt?: number, // Unix ms or seconds timestamp
): void => {
  if (typeof document === "undefined") return;

  // 1. Normalize timestamp (Auto-convert seconds to milliseconds)
  // Unix timestamp in seconds for 2026 is ~1.7B, in ms it is ~1.7T
  // If < 10B, it's definitely seconds.
  let normalizedExpiry = expiresAt;
  if (normalizedExpiry && normalizedExpiry < 10000000000) {
    normalizedExpiry *= 1000;
  }

  const encoded = encodeURIComponent(value);
  const secure = IS_PROD ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";
  const path = "; path=/";
  const expiry = normalizedExpiry
    ? `; expires=${new Date(normalizedExpiry).toUTCString()}`
    : "";
  document.cookie = `${name}=${encoded}${expiry}${path}${sameSite}${secure}`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
};

// ─── Token storage interface ──────────────────────────────────────────────────
export const tokenStorage = {
  getAccessToken: () => getCookie("accessToken"),
  getRefreshToken: () => getCookie("refreshToken"),
  getUserRole: () => getCookie("userRole"),

  // Called on successful login — sets all three cookies at once
  setAll: (
    accessToken: string,
    refreshToken: string,
    role: string,
    // refreshExpiresAt: number, // if server provides expiry time
    accessTokenValidTill: number,
  ) => {
    const refreshExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    setCookie("accessToken", accessToken, accessTokenValidTill);
    setCookie("refreshToken", refreshToken, refreshExpiry);
    // setCookie("accessToken", accessToken, Date.now() + 60 * 60 * 1000); // 1hr
    // setCookie("refreshToken", refreshToken, refreshExpiresAt); // server-controlled
    // setCookie(
    //   "userRole",
    //   role ?? getCookie("userRole") ?? "",
    //   refreshExpiresAt,
    // );
    // userRole cookie uses same expiry as refresh token
    setCookie("userRole", role, refreshExpiry);
  },

  // Called on refresh — updates the access token, and optionally the refresh token
  updateTokens: (accessToken: string, refreshToken?: string) => {
    const oneHour = Date.now() + 60 * 60 * 1000;
    const sevenDays = Date.now() + 7 * 24 * 60 * 60 * 1000;

    setCookie("accessToken", accessToken, oneHour);
    if (refreshToken) {
      setCookie("refreshToken", refreshToken, sevenDays);
    }

    // Keep userRole valid as long as the refresh token (7 days)
    const currentRole = getCookie("userRole");
    if (currentRole) {
      setCookie("userRole", currentRole, sevenDays);
    }
  },

  // Called on logout or auth failure
  clearAll: () => {
    ["accessToken", "refreshToken", "userRole"].forEach(deleteCookie);
  },
};

// ─── Mutex — prevents race condition on concurrent 401s ──────────────────────
// Without this, 3 simultaneous 401s would fire 3 refresh calls.
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// ─── Base query ───────────────────────────────────────────────────────────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://10.10.12.62:6005",
  prepareHeaders: (headers) => {
    // 0. Check for a skip-auth flag
    if (headers.has("x-skip-auth")) {
      headers.delete("x-skip-auth");
      return headers;
    }

    // 1. If Authorization is already set, don't overwrite it
    if (headers.has("Authorization")) {
      return headers;
    }

    // 2. Get access token from storage
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Do NOT set Content-Type for FormData — browser sets it with boundary
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ─── Base query with auto-refresh ─────────────────────────────────────────────
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    // No refresh token — hard logout
    tokenStorage.clearAll();
    const { logout } = await import("../features/authSlice");
    api.dispatch(logout());
    return result;
  }

  if (isRefreshing) {
    // Another call is already refreshing — wait for it to finish
    return new Promise((resolve) => {
      subscribeTokenRefresh(async () => {
        result = await rawBaseQuery(args, api, extraOptions);
        resolve(result);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token/",
        method: "POST",
        headers: { "x-skip-auth": "true" },
        body: { refresh: refreshToken },
      },
      api,
      extraOptions,
    );

    const refreshData = refreshResult.data as RefreshTokenApiResponse | undefined;

    if (refreshData?.success && refreshData?.data) {
      const newToken = refreshData.data.access_token;
      const newRefreshToken = refreshData.data.refresh_token;

      // Update cookies
      tokenStorage.updateTokens(newToken, newRefreshToken);

      // Update Redux state
      const { setCredentials } = await import("../features/authSlice");
      api.dispatch(setCredentials({ 
        access_token: newToken,
        refresh_token: newRefreshToken 
      }));

      // Notify all waiting requests
      onTokenRefreshed(newToken);
      
      // Retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — hard logout
      onTokenRefreshed(""); // Clear waiters with empty token to trigger fallback
      tokenStorage.clearAll();
      const { logout } = await import("../features/authSlice");
      api.dispatch(logout());
    }
  } catch (err) {
    console.error("Token refresh fatal error:", err);
    onTokenRefreshed("");
    tokenStorage.clearAll();
    const { logout } = await import("../features/authSlice");
    api.dispatch(logout());
  } finally {
    isRefreshing = false;
  }

  return result;
};

// ─── Root API slice ───────────────────────────────────────────────────────────
// All feature APIs inject their endpoints here via .injectEndpoints()
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Dashboard", "User", "Auth", "Product", "ProductCategory", "PaymentHistory"],
  endpoints: () => ({}),
});
