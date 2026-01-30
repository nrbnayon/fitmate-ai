"use client";

import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface CanAccessProps {
  resource: string;
  action: string; // e.g., "view", "create", "edit", "delete"
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * CanAccess Component
 * Alternative way to check permissions using resource:action format
 *
 * @example
 * <CanAccess resource="member" action="create">
 *   <AddMemberButton />
 * </CanAccess>
 *
 * <CanAccess
 *   resource="billing"
 *   action="delete"
 *   fallback={<button disabled>Delete (No Permission)</button>}
 * >
 *   <DeleteBillingButton />
 * </CanAccess>
 */
export const CanAccess: React.FC<CanAccessProps> = ({
  resource,
  action,
  children,
  fallback = null,
}) => {
  const { can } = usePermission();

  if (!can(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default CanAccess;
