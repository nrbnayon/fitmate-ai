"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCredentials,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/authSlice";
import { usersData } from "@/data/usersData";

export interface UserInfo {
  name: string | null;
  role: string | null;
  email: string | null;
  image: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Custom hook to manage user authentication state.
 * Synchronizes Redux state with Cookies for persistence.
 */
export function useUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Select from Redux Store (Single Source of Truth)
  const redUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Local loading state for initial hydration check
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Helper to read cookies safely
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const hydrateAuth = () => {
      // If Redux is already authenticated, we are good.
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      // precise sync: try to restore session from cookies
      const accessToken = getCookie("accessToken");
      const role = getCookie("userRole");
      const rawEmail = getCookie("userEmail");
      const email = rawEmail ? decodeURIComponent(rawEmail) : "";

      if (accessToken && role) {
        // SIMULATE API CALL: Find user details from dummy data
        const foundUser = usersData.find((u) => u.email === email);
        const userName = foundUser ? foundUser.name : "User"; // Default if not found
        const userImage = foundUser ? foundUser.image : undefined;

        // Dispatch to Redux to sync state
        dispatch(
          setCredentials({
            user: { name: userName, email, role, image: userImage },
            token: accessToken,
          }),
        );
      }

      setIsChecking(false);
    };

    hydrateAuth();
  }, [isAuthenticated, dispatch]);

  const hasRole = (role: string) => redUser?.role === role;

  const logout = () => {
    // 1. Clear Redux State
    dispatch(logoutAction());

    // 2. Clear Cookies
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log("User logged out successfully");

    // 3. Redirect
    router.push("/signin");
  };

  return {
    name: redUser?.name || null,
    role: redUser?.role || null,
    email: redUser?.email || null,
    image: redUser?.image || null,
    // We don't necessarily store the token string in the public `user` object in Redux if we want to be minimal,
    // but authSlice has it.
    accessToken: useAppSelector((state) => state.auth.token),
    isAuthenticated,
    isLoading: isChecking,
    hasRole,
    logout,
  };
}
