
import { NextRequest, NextResponse } from "next/server";

// ============================================
// ROLES
// ============================================

const ROLES = {
  ADMIN: "admin",
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

// ============================================
// ROUTE LISTS
// ============================================

// ── Auth routes ───────────────────────────────────────────────────────────────
// Pages that only make sense when the user is NOT authenticated.
// Authenticated users hitting these get bounced to their dashboard.
const AUTH_ROUTES = [
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/reset-success",
  "/verify-otp",
];

// ── Standalone public auth-flow page ─────────────────────────────────────────
// /success is shown after email verification / payment — not a login page,
// so authenticated users are NOT bounced away from it.
const PUBLIC_ONLY_ROUTES = ["/success"];

// ── Info / legal routes ───────────────────────────────────────────────────────
// Always accessible to EVERYONE — authenticated or not, any role.
// NOTE: /privacy-policy lives inside app/(protected)/(shared)/ in the file tree,
// but it must remain publicly readable (legal requirement), so we allow it here
// before any auth check is performed.
const INFO_ROUTES = [
  "/privacy-policy",
  "/terms", // add page later if needed
  "/about-us", // add page later if needed
];

// ── Universal protected routes ────────────────────────────────────────────────
// Accessible to ANY authenticated user regardless of role.
// Maps to app/(protected)/(shared)/*
const UNIVERSAL_PROTECTED_ROUTES = ["/profile", "/settings", "/notifications"];

// ── Admin-only protected routes ───────────────────────────────────────────────
// Maps to app/(protected)/(admin)/*
const ROLE_ROUTES: Record<Role, string[]> = {
  [ROLES.ADMIN]: [
    "/dashboard",
    "/categories",
    "/commission-tracking",
    "/order-management",
    "/payment-history",
    "/products",
    "/user-management",
  ],
};

// ── Default redirect landing per role ─────────────────────────────────────────
const ROLE_DEFAULT_PATHS: Record<Role, string> = {
  [ROLES.ADMIN]: "/dashboard",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Exact match OR directory-boundary prefix match.
 * "/dashboard"  →  matches "/dashboard" and "/dashboard/stats"
 *                  but NOT "/dashboard-old"
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function getRoleDefaultPath(userRole: string): string {
  return ROLE_DEFAULT_PATHS[userRole as Role] ?? "/dashboard";
}

function hasRoleAccess(pathname: string, userRole: string): boolean {
  const allowed = ROLE_ROUTES[userRole as Role];
  if (!allowed) return false;
  return matchesRoute(pathname, allowed);
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ============================================
// MAIN PROXY FUNCTION
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bypass: Next.js internals, API routes, PWA files, static assets ──────────
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname === "/~offline" || // PWA offline page — Next.js handles it natively
    pathname.includes(".") // any file with an extension (.png, .svg, .js …)
  ) {
    return NextResponse.next();
  }

  // ============================================
  // STEP 1: Read auth state from cookies
  // ============================================
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole = request.cookies.get("userRole")?.value ?? "";
  const isAuthenticated = !!accessToken || !!refreshToken;
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;

  // ============================================
  // STEP 2: INFO routes — always accessible, skip ALL auth logic
  // /privacy-policy  /terms  /about-us
  // ============================================
  if (matchesRoute(pathname, INFO_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 3: Root "/" — dual behavior
  //   Authenticated admin  → /dashboard
  //   Unauthenticated      → render app/page.tsx (landing or /signin redirect)
  // ============================================
  if (pathname === "/") {
    if (isAdmin) {
      return NextResponse.redirect(
        new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
      );
    }
    // Not authenticated → app/page.tsx handles the UI
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 4: AUTH routes — bounce away if already logged in
  // /signin  /forgot-password  /reset-password  /reset-success  /verify-otp
  // ============================================
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAdmin) {
      return NextResponse.redirect(
        new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 5: Public-only routes (not auth pages, not protected)
  // /success
  // ============================================
  if (matchesRoute(pathname, PUBLIC_ONLY_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 6: Everything else is PROTECTED — deny-by-default
  // ============================================

  // 6a. Not authenticated → redirect to /signin with return path
  if (!isAuthenticated) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6b. Authenticated but role cookie is missing / unrecognized
  if (!userRole) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("error", "missing_role");
    return NextResponse.redirect(loginUrl);
  }

  // 6c. Universal protected routes — any authenticated role
  // /profile  /settings  /notifications
  if (matchesRoute(pathname, UNIVERSAL_PROTECTED_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // 6d. Role-specific route check
  // /dashboard  /commission-tracking  /order-management  etc.
  if (hasRoleAccess(pathname, userRole)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // 6e. Authenticated but role does NOT have access → safe fallback
  console.warn(
    `🚫 Access denied: role="${userRole}" tried to access "${pathname}"`,
  );
  return NextResponse.redirect(
    new URL(getRoleDefaultPath(userRole), request.url),
  );
}

// ============================================
// MIDDLEWARE MATCHER
// ============================================

export const config = {
  matcher: [
    /*
     * Intercept ALL paths EXCEPT:
     *  - _next/static            compiled JS / CSS bundles
     *  - _next/image             Next.js image optimization
     *  - favicon.ico, favicon-96x96.png
     *  - PWA files               manifest.json, manifest.webmanifest,
     *                            sw.js, swe-worker-*.js, workbox-*.js,
     *                            web-app-manifest-*.png, apple-touch-icon.png
     *  - Public asset folders    /icons/  /images/
     *  - Static file extensions  svg, png, jpg, jpeg, gif, webp, ico,
     *                            woff, woff2, ttf, eot, otf,
     *                            mp4, mp3, pdf, csv, xml, txt, js
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon-96x96\\.png|manifest\\.json|manifest\\.webmanifest|sw\\.js|swe-worker|workbox|web-app-manifest|apple-touch-icon|icons/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|mp3|pdf|csv|xml|txt|js)$).*)",
  ],
};
