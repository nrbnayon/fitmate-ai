"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { 
  selectIsAuthenticated, 
  selectCurrentUser, 
  loginSuccess, 
  setProfile 
} from "@/redux/features/authSlice";
import { tokenStorage } from "@/redux/features/apiSlice";
import { useLazyGetProfileQuery } from "@/redux/services/authApi";
import type { UserRole } from "@/types/auth.types";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const [fetchProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    // 1. Rehydrate basic state from cookies if Redux is empty
    const accessToken = tokenStorage.getAccessToken();
    const role = tokenStorage.getUserRole() as UserRole | null;

    if (!isAuthenticated && accessToken && role) {
      dispatch(
        loginSuccess({
          access_token: accessToken,
          refresh_token: tokenStorage.getRefreshToken() ?? "",
          role,
          user_id: "", // will be enriched by profile fetch
          access_token_valid_till: 0,
        })
      );
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // 2. Fetch profile if authenticated but missing detailed data
    if (isAuthenticated && (!user || !user.full_name)) {
      fetchProfile()
        .unwrap()
        .then((res) => {
          if (res.success && res.data) {
            dispatch(setProfile(res.data));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile during initialization:", err);
        });
    }
  }, [isAuthenticated, user, fetchProfile, dispatch]);

  return <>{children}</>;
}
