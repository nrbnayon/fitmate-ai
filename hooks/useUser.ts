"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectUserRole,
  selectIsAdmin,
} from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/auth.types";

/**
 * Custom hook to access global authentication state.
 * Simplifies access to user data and common auth actions.
 */
export function useUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const role = useAppSelector(selectUserRole);
  const isAdmin = useAppSelector(selectIsAdmin);

  const logout = () => {
    dispatch(logoutAction());
    router.push("/signin");
  };

  const hasRole = (r: UserRole) => user?.role === r;

  return {
    user,
    // De-structured for convenience/compatibility
    userId: user?.user_id ?? null,
    fullName: user?.full_name ?? null,
    name: user?.full_name || null, // Compatibility with some components
    email: user?.email ?? null,
    role,
    image: user?.profile_picture || null, // Compatibility
    profilePicture: user?.profile_picture ?? null,
    phoneNumber: user?.phone_number ?? null,
    address: user?.address ?? null,
    
    isAuthenticated,
    isAdmin,
    isLoading,
    hasRole,
    logout,
  };
}
