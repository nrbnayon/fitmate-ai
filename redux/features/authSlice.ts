// redux/features/authSlice.ts
// Global auth state — single source of truth for the entire app.
// On page refresh, rehydrates from cookies so the user stays logged in.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "../features/apiSlice";
import type {
  AuthState,
  AuthUser,
  LoginResponseData,
  ProfileResponseData,
  UserRole,
} from "@/types/auth.types";
import type { RootState } from "../store";

// ─── Rehydration from cookies ─────────────────────────────────────────────────
// Runs once on app boot (client-side only).
// Rebuilds minimal user object so isAuthenticated is correct after page refresh.
function buildInitialState(): AuthState {
  if (typeof window === "undefined") {
    // SSR — no cookies available here; proxy.ts handles server-side auth
    return { user: null, isAuthenticated: false, isLoading: false };
  }

  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();
  const role = tokenStorage.getUserRole() as UserRole | null;

  if ((accessToken || refreshToken) && role) {
    return {
      user: {
        user_id: "", // will be enriched when getProfile is called
        role,
      },
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return { user: null, isAuthenticated: false, isLoading: false };
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: buildInitialState,
  reducers: {
    /**
     * loginSuccess — called right after POST /auth/login/ succeeds.
     * Stores all tokens in cookies + populates Redux state.
     */
    loginSuccess: (state, action: PayloadAction<LoginResponseData>) => {
      const {
        access_token,
        refresh_token,
        role,
        user_id,
        access_token_valid_till,
      } = action.payload;

      // Persist to cookies (proxy.ts reads these for route protection)
      tokenStorage.setAll(
        access_token,
        refresh_token,
        role,
        access_token_valid_till,
      );

      state.user = { user_id, role };
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    /**
     * setProfile — called after GET /auth/admin/profile/ succeeds.
     * Enriches the user object with display data.
     */
    setProfile: (state, action: PayloadAction<ProfileResponseData>) => {
      if (!state.user) return;
      const { full_name, email, profile_picture, phone_number, address } =
        action.payload;
      state.user.full_name = full_name;
      state.user.email = email;
      state.user.profile_picture = profile_picture;
      state.user.phone_number = phone_number;
      state.user.address = address;
    },

    /**
     * setCredentials — called by baseQueryWithReauth after a token refresh.
     * Only the access token changes; everything else stays the same.
     */
    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string }>,
    ) => {
      // Cookie already updated in apiSlice.ts baseQueryWithReauth.
      // Mark as authenticated in case of edge-case where it was false.
      state.isAuthenticated = !!action.payload.access_token;
    },

    /**
     * logout — called on manual logout or hard auth failure.
     * Clears cookies + resets state.
     */
    logout: (state) => {
      tokenStorage.clearAll();
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginSuccess, setProfile, setCredentials, logout, setLoading } =
  authSlice.actions;

export default authSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser = (state: RootState): AuthUser | null =>
  state.auth.user;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

export const selectUserRole = (state: RootState): UserRole | null =>
  state.auth.user?.role ?? null;

export const selectIsLoading = (state: RootState): boolean =>
  state.auth.isLoading;

export const selectIsAdmin = (state: RootState): boolean =>
  state.auth.user?.role === "admin";
