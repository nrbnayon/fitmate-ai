// components/Sidebar.tsx
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  PanelLeftOpen,
  PanelRightOpen,
  ChevronDown,
  ChevronUp,
  Bell,
  CreditCard,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  PackageAddIcon,
  Settings01Icon,
  UserMultiple03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import LogoutModal from "../Shared/LogoutModal";

interface SubLink {
  label: string;
  href: string;
  roles?: string[];
}

interface LinkType {
  label: string;
  href: string;
  icon: any; // React.ElementType | React.ReactNode | IconSvgElement
  subLinks?: SubLink[];
  roles?: string[];
}

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const pathname = usePathname();
  // Use centralized user hook
  const { name, role, isAuthenticated, logout } = useUser();

  // State management
  const [open, setOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [, setUserResizedWidth] = useState<number | null>(null);
  const [manualToggle, setManualToggle] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const minWidth = 80;
  const maxWidth = 400;

  // Navigation links configuration
  const links: LinkType[] = useMemo(
    () => [
      // Admin Routes
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: DashboardSquare02Icon,
        roles: ["admin"],
      },
      {
        label: "User Management",
        href: "/user-management",
        icon: UserMultiple03Icon,
        roles: ["admin"],
      },
      {
        label: "Products",
        href: "/products",
        icon: PackageAddIcon,
        roles: ["admin"],
      },
      {
        label: "Payment History",
        href: "/payment-history",
        icon: <CreditCard />,
        roles: ["admin"],
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: <Bell className="w-5 h-5" />,
        roles: ["admin"],
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings01Icon,
        roles: ["admin"],
      },
    ],
    []
  );

  // Filter links based on user role
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // If no roles defined, everyone sees it
      if (!link.roles || link.roles.length === 0) return true;
      // If user has a role, check if it's allowed
      return role ? link.roles.includes(role) : false;
    });
  }, [links, role]);

  // Check if current path matches link
  const isLinkActive = useCallback(
    (link: LinkType) => {
      if (pathname === link.href) return true;
      if (pathname.startsWith(link.href + "/")) return true;

      if (link.subLinks) {
        return link.subLinks.some((subLink) => {
          if (pathname === subLink.href) return true;
          if (pathname.startsWith(subLink.href + "/")) return true;
          return false;
        });
      }

      return false;
    },
    [pathname]
  );

  // Toggle expanded state
  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  }, []);

  // Auto-expand items if their sublink is active
  useEffect(() => {
    filteredLinks.forEach((link) => {
      if (
        link.subLinks &&
        link.subLinks.some(
          (subLink) =>
            pathname === subLink.href || pathname.startsWith(subLink.href + "/")
        )
      ) {
        if (!expandedItems.includes(link.label)) {
          setExpandedItems((prev) => [...prev, link.label]);
        }
      }
    });
  }, [pathname, filteredLinks, expandedItems]);

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, minWidth),
        maxWidth
      );

      setSidebarWidth(newWidth);
      setUserResizedWidth(newWidth);

      if (newWidth <= minWidth + 20) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth]);

  useEffect(() => {
    if (!isResizing && manualToggle) {
      const timeoutId = setTimeout(() => {
        if (open) {
          setSidebarWidth(290);
          setUserResizedWidth(290);
        } else {
          setSidebarWidth(minWidth);
        }
        setManualToggle(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [open, isResizing, manualToggle, minWidth]);

  const handleToggleClick = () => {
    if (!isResizing) {
      const newOpen = !open;
      if (newOpen) {
        setSidebarWidth(290);
        setUserResizedWidth(290);
      } else {
        setSidebarWidth(minWidth);
      }
      setOpen(newOpen);
    } else {
      setManualToggle(true);
      setOpen(!open);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const renderIcon = useCallback((Icon: any, isActive: boolean) => {
    const iconClasses = cn(
        "h-6 w-6 shrink-0 transition-colors duration-200",
        isActive
          ? "text-white font-bold"
          : "text-foreground group-hover:text-foreground font-bold"
    );

    // 1. If it's a valid React Element (pre-rendered JSX like <Bell />), clone it to inject classes if needed or just return
    if (React.isValidElement(Icon)) {
        return React.cloneElement(Icon as React.ReactElement<any>, {
            className: cn((Icon.props as any).className, iconClasses)
        });
    }

    // 2. If it's a Hugeicon object (legacy check from @hugeicons/core-free-icons)
    // We assume if it's an object with specific shape it might be Hugeicon data, but generally components are functions.
    // However, the original code used HugeiconsIcon component which specifically takes `icon={icon}` data.
    // Let's heuristics: if passed icon is likely not a component (function) but an object, try HugeiconsIcon.
    // DashboardSquare02Icon is an object usually.
    if (typeof Icon === 'object' && !React.isValidElement(Icon)) {
         return (
          <HugeiconsIcon
            icon={Icon}
            strokeWidth={2}
            className={iconClasses}
          />
        );
    }

    // 3. Assume it's a Component (Lucide, React-Icon, or FontAwesome component)
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className={iconClasses} />;
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-primary";
      case "user":
        return "text-secondary";
      default:
        return "text-primary";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "user":
        return "User";
      default:
        return "Admin";
    }
  };

  // If not authenticated, render children without sidebar
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gray">
        <div className="p-0 flex flex-col gap-2 flex-1 w-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray w-full flex-1 mx-auto",
        "min-h-screen md:h-screen md:overflow-hidden relative"
      )}
    >
      <div className="relative overflow-visible flex">
        <Sidebar
          open={open}
          setOpen={setOpen}
          animate={true}
          width={sidebarWidth}
        >
          <SidebarBody
            className={cn(
              "justify-between gap-10 border-0.5",
              "bg-white text-foreground"
            )}
          >
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex items-center justify-center my-6">
                <Logo open={open} />
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                {filteredLinks.map((link, idx) => {
                  const isActive = isLinkActive(link);
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedItems.includes(link.label);
                  const isHovered = hoveredItem === link.label;

                  const filteredSubLinks = link.subLinks?.filter(
                    (subLink) =>
                      !subLink.roles || (role && subLink.roles.includes(role))
                  );

                  const shouldShowSublinks =
                    hasSubLinks &&
                    (isExpanded || isHovered) &&
                    open &&
                    filteredSubLinks &&
                    filteredSubLinks.length > 0;

                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => {
                        if (hasSubLinks) {
                          setHoveredItem(link.label);
                        }
                      }}
                      onMouseLeave={() => {
                        if (hasSubLinks && !isExpanded) {
                          setTimeout(() => {
                            setHoveredItem((prev) =>
                              prev === link.label ? null : prev
                            );
                          }, 200);
                        }
                      }}
                    >
                      {/* Main Link */}
                      <div className="flex items-center relative">
                        <Link
                          href={link.href}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              setOpen(false);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-md transition-all duration-200 group flex-1 relative",
                            isActive
                              ? "bg-primary text-white font-bold"
                              : "hover:text-foreground hover:bg-primary/30"
                          )}
                        >
                          <span className="shrink-0">
                            {renderIcon(link.icon, isActive)}
                          </span>
                          <motion.span
                            animate={{
                              display: open ? "inline-block" : "none",
                              opacity: open ? 1 : 0,
                            }}
                            className="text-sm md:text-base"
                          >
                            {link.label}
                          </motion.span>

                          {/* Expand/Collapse Button */}
                          {hasSubLinks && open && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpanded(link.label);
                              }}
                              className={cn(
                                "p-1 rounded transition-all duration-200 hover:bg-gray-200",
                                isActive && "text-white"
                              )}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </Link>
                      </div>

                      {/* Sub Links Container */}
                      {shouldShowSublinks && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-1 space-y-1 overflow-hidden"
                          onMouseEnter={() => {
                            setHoveredItem(link.label);
                          }}
                          onMouseLeave={() => {
                            if (!isExpanded) {
                              setTimeout(() => {
                                setHoveredItem((prev) =>
                                  prev === link.label ? null : prev
                                );
                              }, 200);
                            }
                          }}
                        >
                          {filteredSubLinks.map((subLink, subIdx) => {
                            const isSubLinkActive =
                              pathname === subLink.href ||
                              pathname.startsWith(subLink.href + "/");

                            return (
                              <Link
                                key={subIdx}
                                href={subLink.href}
                                onClick={() => {
                                  if (window.innerWidth < 768) {
                                    setOpen(false);
                                  }
                                }}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm",
                                  isSubLinkActive
                                    ? "bg-gradient-purple text-white font-bold"
                                    : "text-secondary hover:text-primary hover:bg-gray-50"
                                )}
                              >
                                <span className="text-sm whitespace-pre">
                                  {subLink.label}
                                </span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              {/* User Profile */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3">
                  <Link
                    href="/profile"
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setOpen(false);
                      }
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <Image
                        src="/images/avatar.png"
                        alt="User"
                        width={40}
                        height={40}
                      />
                    </div>
                    <motion.div
                      animate={{
                        display: open ? "block" : "none",
                        opacity: open ? 1 : 0,
                      }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-base font-medium truncate">
                        {name || "User"}
                      </p>
                      <p
                        className={cn(
                          "text-sm truncate",
                          getRoleBadgeColor(role || "customer")
                        )}
                      >
                        {getRoleDisplayName(role || "customer")}
                      </p>
                    </motion.div>
                  </Link>
                  <motion.button
                    onClick={handleLogoutClick}
                    animate={{
                      display: open ? "block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="p-1 hover:bg-red-50 rounded transition-colors hover:text-red-500 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Resizable Border */}
        <div
          className="hidden md:block w-1 bg-white cursor-col-resize border-r border-gray-200 hover:bg-blue-500/20 transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 w-2 -ml-0.5 bg-transparent" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggleClick}
          className={cn(
            "absolute hidden md:flex top-4 z-20 cursor-pointer p-2 rounded-full bg-gray border border-gray-300 shadow-none hover:bg-gray-50 transition-all duration-200",
            open ? "-right-4" : "-right-4"
          )}
        >
          {open ? (
            <PanelRightOpen className="h-4 w-4 text-secondary" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 text-secondary" />
          )}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={logout}
      />

      <Dashboard>{children}</Dashboard>
    </div>
  );
}

const Logo = ({ open }: { open: boolean }) => {
  return (
    <div className="font-normal flex items-center text-sm relative z-20 w-full justify-center">
      <motion.div
        animate={{
          width: open ? "120px" : "40px",
          height: open ? "auto" : "40px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-center overflow-hidden"
      >
        <Image
          className="w-full h-full object-contain"
          alt="Logo"
          src="/icons/logo.svg"
          width={open ? 120 : 40}
          height={open ? 120 : 40}
          priority
        />
      </motion.div>
    </div>
  );
};

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 bg-gray">
      <div className="p-0 flex flex-col gap-2 flex-1 w-full md:h-screen md:overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};