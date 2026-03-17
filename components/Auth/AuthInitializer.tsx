"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  rehydrateAuth,
  setCredentials,
  setProfile,
  logout,
} from "@/redux/features/authSlice";
import { tokenStorage } from "@/redux/features/apiSlice";
import {
  useLazyGetProfileQuery,
  useRefreshTokenMutation,
} from "@/redux/services/authApi";
import type { UserRole } from "@/types/auth.types";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const [fetchProfile] = useLazyGetProfileQuery();
  const [refreshToken] = useRefreshTokenMutation();

  // Guard against running the refresh attempt more than once per mount
  const refreshAttemptedRef = useRef(false);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    const storedRefreshToken = tokenStorage.getRefreshToken();
    const role = tokenStorage.getUserRole() as UserRole | null;

    if (isAuthenticated) return; // Redux already has state — nothing to do

    // ── Case 1: Access token is present → just rehydrate Redux ───────────────
    if (accessToken && role) {
      dispatch(rehydrateAuth({ user_id: "", role }));
      return;
    }

    // ── Case 2: Only refresh token exists → silently get a new access token ──
    // This happens when the ~1h access token cookie expires but the 7-day
    // refresh token is still valid. The middleware already redirected us here.
    if (!accessToken && storedRefreshToken && !refreshAttemptedRef.current) {
      refreshAttemptedRef.current = true;

      refreshToken({ refresh: storedRefreshToken })
        .unwrap()
        .then((res) => {
          if (res.success && res.data) {
            const { access_token, refresh_token } = res.data;

            // Write the new tokens into cookies (keeps the user logged in)
            tokenStorage.updateTokens(access_token, refresh_token);

            // Restore the role (still in the userRole cookie)
            const currentRole = tokenStorage.getUserRole() as UserRole | null;
            if (currentRole) {
              dispatch(rehydrateAuth({ user_id: "", role: currentRole }));
              dispatch(
                setCredentials({ access_token, refresh_token }),
              );

              // Redirect back to where the user was trying to go
              const redirectTo = searchParams?.get("redirect") ?? "/dashboard";
              router.replace(redirectTo);
            } else {
              // Role cookie missing — can't identify the user, force re-login
              tokenStorage.clearAll();
              dispatch(logout());
            }
          } else {
            // Refresh failed (refresh token itself expired) — hard logout
            tokenStorage.clearAll();
            dispatch(logout());
          }
        })
        .catch(() => {
          // Network failure or server error — hard logout
          tokenStorage.clearAll();
          dispatch(logout());
        });
    }

    // ── Case 3: No tokens at all → nothing to rehydrate, leave as-is ─────────
    // The proxy middleware will have already redirected to /signin.
  }, [dispatch, isAuthenticated, refreshToken, router, searchParams]);

  // ── Step 2: Fetch profile once authenticated and profile data is missing ────
  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.full_name) return; // already enriched — skip

    fetchProfile()
      .unwrap()
      .then((res) => {
        if (res.success && res.data) {
          dispatch(setProfile(res.data));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile during initialization:", err);
        // Non-fatal — token refresh is handled by baseQueryWithReauth
      });
  }, [isAuthenticated, user?.full_name, fetchProfile, dispatch]);

  return <>{children}</>;
}
