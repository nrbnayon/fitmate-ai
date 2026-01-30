"use client";

import { useUser } from "@/hooks/useUser";

/**
 * Define permissions configuration.
 *
 * This object maps resources to roles and the actions they can perform.
 *
 * Structure:
 * {
 *   [resource]: {
 *     [action]: [allowed_roles]
 *   }
 * }
 */
export const PERMISSIONS = {
  member: {
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
    view: ["admin", "user"],
  },
  billing: {
    view: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
  },
  property: {
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
    view: ["admin", "user"],
  },
  reports: {
    view: ["admin", "user"],
    create: ["admin"],
    download: ["admin", "user"],
  },
  // Add more resources and permissions here
};

export type Resource = keyof typeof PERMISSIONS;
export type Action<T extends Resource> = keyof (typeof PERMISSIONS)[T];

export function usePermission() {
  const { role } = useUser();

  /**
   * Check if the current user has permission to perform an action on a resource.
   *
   * @param resource - The resource being accessed (e.g., "member", "billing")
   * @param action - The action being performed (e.g., "create", "view")
   * @returns true if authorized, false otherwise
   */
  const can = (resource: string, action: string): boolean => {
    if (!role) return false;

    // Type safety workaround since keys are strings at runtime
    const resourcePermissions = PERMISSIONS[resource as Resource];
    if (!resourcePermissions) return false;

    const allowedRoles =
      resourcePermissions[action as keyof typeof resourcePermissions];
    if (!allowedRoles) return false;

    // Check if the user's role is in the allowed roles list
    // You can extend this logic to support hierarchical roles if needed
    // e.g. if (role === 'admin') return true;

    // Simple exact match for now
    return (allowedRoles as string[]).includes(role);
  };

  return { can };
}
