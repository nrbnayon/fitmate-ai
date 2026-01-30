// proxy.ts - Next.js v16 Role-based Access Control Middleware
import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

// ============================================
// CONFIGURATION
// ============================================

// Define Roles
const ROLES = {
  ADMIN: "admin"
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp",
  "/reset-success",
  "/success",
  "/terms",
  "/privacy-policy",
  "/about-us",
];

// Auth routes (redirect to dashboard if already logged in)
const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/reset-password"];

// Protected routes accessible by ALL authenticated users
// (Merges previous COMMON_PROTECTED_ROUTES and SHARED_ROUTES)
const UNIVERSAL_PROTECTED_ROUTES = [
  "/notifications",
  "/settings",
  "/profile",
  "/privacy-policy", 
  "/terms",
  "/about-us",
];

// Role-specific access configuration
// Keys are roles, values are arrays of allowed route prefixes
const ROLE_ACCESS_CONFIG: Record<Role, string[]> = {
  [ROLES.ADMIN]: ["/"],
};

// Default redirect paths for each role after login
const ROLE_DEFAULT_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: "/",
};

// JWT Secret - Use environment variable in production
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify JWT token
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("❌ Error verifying token:", error);
    return null;
  }
}

/**
 * Check if a path matches any route in the list (Exact or Sub-path)
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match (e.g., /dashboard matches /dashboard/*)
    // Ensure we match directory boundary so /super-admin doesn't match /super-admin-fake
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

/**
 * Check if a user role has access to a specific path
 */
function hasRoleAccess(pathname: string, userRole: string): boolean {
  // 0. Super User / Admin Bypass
  if (userRole === ROLES.ADMIN) return true;

  // 1. Check Universal Protected Routes (All Auth Users)
  if (matchesRoute(pathname, UNIVERSAL_PROTECTED_ROUTES)) {
    return true;
  }

  // 2. Check Role-Specific Routes
  const roleRoutes = ROLE_ACCESS_CONFIG[userRole as Role];
  if (roleRoutes && matchesRoute(pathname, roleRoutes)) {
    return true;
  }

  return false;
}

/**
 * Get the appropriate redirect path for a role
 */
function getRoleDefaultPath(userRole: string): string {
  return ROLE_DEFAULT_PATHS[userRole as Role] || "/";
}

// ============================================
// MAIN PROXY FUNCTION (Next.js v16)
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes and PWA files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") || // Catches files with extensions
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/~offline"
  ) {
    return NextResponse.next();
  }

  console.log("🔐 Middleware:", pathname);

  // ============================================
  // STEP 1: Check Public Routes
  // ============================================
  const isPublic = matchesRoute(pathname, PUBLIC_ROUTES);

  // ============================================
  // STEP 2: Extract & Verify Auth
  // ============================================
  const accessToken = request.cookies.get("accessToken")?.value;
  let userRole = request.cookies.get("userRole")?.value;
  let isAuthenticated = false;
  let user = null;

  if (accessToken) {
    // Development Bypass Tokens
    if (accessToken === "dev-admin-token" || accessToken.startsWith("mock_access_token_")) {
      user = { email: "admin@gmail.com", role: ROLES.ADMIN };
      isAuthenticated = true;
      userRole = userRole || ROLES.ADMIN;
    } else {
      // Real JWT Verification
      user = await verifyToken(accessToken);
      isAuthenticated = !!user;
      if (user && !userRole) {
        userRole = (user.role as string) || (user.userRole as string);
      }
    }
  }

  // ============================================
  // STEP 3: Handle Public Routes & Redirects
  // ============================================
  if (isPublic) {
    // If user is authenticated and tries to access login/signup, redirect to dashboard
    if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
      const defaultPath = getRoleDefaultPath(userRole || ROLES.ADMIN);
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }

    // Allow access to public route
    const response = NextResponse.next();
    // Security Headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // ============================================
  // STEP 4: Handle Protected Routes
  // ============================================
  
  // If we are here, the route is NOT public.
  // We assume specific deny-list implies everything else is protected? 
  // OR we check if it matches a known protected path.
  // NOTE: Original logic had a "Step 5" for unknown routes handling. 
  // To be safe and "secure", we treat non-public routes as protected by default.
  
  if (!isAuthenticated) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    console.log("❌ Unauthorized - Redirecting to login");
    return NextResponse.redirect(loginUrl);
  }

  // Verify Role Access
  if (!hasRoleAccess(pathname, userRole || "")) {
    console.log("❌ Forbidden - User role does not have access to:", pathname);
    // Determine if it's a valid route at all? 
    // Ideally we should 404 if it doesn't exist, but middleware doesn't know filesystem.
    // For security, redirecting to default path is safe.
    const defaultPath = getRoleDefaultPath(userRole || ROLES.ADMIN);
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  console.log("✅ Authorized - Access granted");
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.json|sw\\.js|web-app-manifest|apple-touch-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};