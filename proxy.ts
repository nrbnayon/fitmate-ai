// // proxy.ts — fitmate-ai | Next.js Role-Based Access Control Middleware
// //
// // ⚠️  SECURITY NOTE:
// // JWT cryptographic verification is intentionally NOT done here.
// // The backend API already verifies the JWT on every protected endpoint.
// // This proxy is a routing guard only — it checks cookie presence + role.
// //
// // Project route map (from app/ file tree):
// //
// //   app/page.tsx                              → "/"
// //   app/(auth)/signin/page.tsx                → /signin
// //   app/(auth)/forgot-password/page.tsx       → /forgot-password
// //   app/(auth)/reset-password/page.tsx        → /reset-password
// //   app/(auth)/reset-success/page.tsx         → /reset-success
// //   app/(auth)/verify-otp/page.tsx            → /verify-otp
// //   app/(auth)/success/page.tsx               → /success
// //   app/(protected)/(shared)/profile          → /profile
// //   app/(protected)/(shared)/settings         → /settings
// //   app/(protected)/(shared)/notifications    → /notifications
// //   app/(protected)/(shared)/privacy-policy   → /privacy-policy
// //   app/(protected)/(admin)/dashboard         → /dashboard
// //   app/(protected)/(admin)/commission-tracking
// //   app/(protected)/(admin)/order-management
// //   app/(protected)/(admin)/payment-history
// //   app/(protected)/(admin)/products
// //   app/(protected)/(admin)/user-management

// import { NextRequest, NextResponse } from "next/server";

// // ============================================
// // ROLES
// // ============================================

// const ROLES = {
//   ADMIN: "admin",
// } as const;

// type Role = (typeof ROLES)[keyof typeof ROLES];

// // ============================================
// // DEV MODE CONFIG
// // ============================================

// const IS_DEV = process.env.NODE_ENV === "development";

// // When true — middleware is completely bypassed in development.
// // Lets you freely test /signin, /dashboard, any page without real cookies.
// //
// // ✅ Set to true  → dev freedom, no auth enforcement
// // ✅ Set to false → full middleware runs even in dev (good for testing auth flow)
// //
// // 🚨 REMOVE THIS ENTIRE BLOCK before shipping to production.
// const DEV_BYPASS_ALL = IS_DEV && true;

// // Mock credentials accepted in dev mode (only when DEV_BYPASS_ALL is false).
// // These let you fake a logged-in session by setting cookies manually,
// // e.g. in browser DevTools → Application → Cookies:
// //   accessToken = dev-admin-token
// //   userRole    = admin
// //
// // 🚨 REMOVE THIS LIST before shipping to production.
// const DEV_MOCK_TOKENS = IS_DEV
//   ? ["dev-admin-token", "dev-token", "mock_access_token"]
//   : [];

// // ============================================
// // ROUTE LISTS
// // ============================================

// // Bounce authenticated users AWAY from these
// const AUTH_ROUTES = [
//   "/signin",
//   "/forgot-password",
//   "/reset-password",
//   "/reset-success",
//   "/verify-otp",
// ];

// // Public, but authenticated users are NOT bounced (e.g. post-payment screen)
// const PUBLIC_ONLY_ROUTES = ["/success"];

// // Always accessible to everyone — no auth check ever
// // /privacy-policy lives in (protected)/(shared)/ in the file tree but must
// // remain publicly readable for legal reasons, so it is whitelisted here.
// const INFO_ROUTES = ["/privacy-policy", "/terms", "/about-us"];

// // Any authenticated user, regardless of role
// const UNIVERSAL_PROTECTED_ROUTES = ["/profile", "/settings", "/notifications"];

// // Role-specific protected routes
// const ROLE_ROUTES: Record<Role, string[]> = {
//   [ROLES.ADMIN]: [
//     "/dashboard",
//     "/commission-tracking",
//     "/order-management",
//     "/payment-history",
//     "/products",
//     "/user-management",
//   ],
// };

// const ROLE_DEFAULT_PATHS: Record<Role, string> = {
//   [ROLES.ADMIN]: "/dashboard",
// };

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

// function matchesRoute(pathname: string, routes: string[]): boolean {
//   return routes.some(
//     (route) => pathname === route || pathname.startsWith(route + "/"),
//   );
// }

// function getRoleDefaultPath(userRole: string): string {
//   return ROLE_DEFAULT_PATHS[userRole as Role] ?? "/dashboard";
// }

// function hasRoleAccess(pathname: string, userRole: string): boolean {
//   const allowed = ROLE_ROUTES[userRole as Role];
//   if (!allowed) return false;
//   return matchesRoute(pathname, allowed);
// }

// function withSecurityHeaders(response: NextResponse): NextResponse {
//   response.headers.set("X-Frame-Options", "DENY");
//   response.headers.set("X-Content-Type-Options", "nosniff");
//   response.headers.set("X-XSS-Protection", "1; mode=block");
//   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
//   return response;
// }

// /**
//  * Resolve auth state from cookies.
//  * In dev mode, also accepts mock tokens from DEV_MOCK_TOKENS list.
//  */
// function resolveAuth(request: NextRequest): {
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   userRole: string;
// } {
//   const accessToken = request.cookies.get("accessToken")?.value ?? "";
//   let userRole = request.cookies.get("userRole")?.value ?? "";

//   // Dev mock token check — skipped entirely in production
//   if (IS_DEV && DEV_MOCK_TOKENS.some((t) => accessToken.startsWith(t))) {
//     // Mock token → treat as admin so all protected pages are reachable
//     userRole = userRole || ROLES.ADMIN;
//     return { isAuthenticated: true, isAdmin: true, userRole };
//   }

//   const isAuthenticated = !!accessToken;
//   const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;
//   return { isAuthenticated, isAdmin, userRole };
// }

// // ============================================
// // MAIN PROXY FUNCTION
// // ============================================

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // ── Bypass: Next.js internals, API routes, PWA files, static assets ──────────
//   if (
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/api/") ||
//     pathname === "/favicon.ico" ||
//     pathname === "/manifest.json" ||
//     pathname === "/manifest.webmanifest" ||
//     pathname === "/sw.js" ||
//     pathname === "/~offline" ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   // ============================================
//   // 🚧 DEV BYPASS — remove before production
//   // Skips all auth enforcement so you can freely visit any page
//   // without needing real cookies or a running backend.
//   // Toggle DEV_BYPASS_ALL above to enable / disable.
//   // ============================================
//   if (DEV_BYPASS_ALL) {
//     console.log(`🚧 [DEV BYPASS] ${pathname} — auth skipped`);
//     return NextResponse.next();
//   }

//   // ============================================
//   // STEP 1: Resolve auth state
//   // ============================================
//   const { isAuthenticated, isAdmin, userRole } = resolveAuth(request);

//   // ============================================
//   // STEP 2: INFO routes — always accessible
//   // /privacy-policy  /terms  /about-us
//   // ============================================
//   if (matchesRoute(pathname, INFO_ROUTES)) {
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // ============================================
//   // STEP 3: Root "/" — dual behavior
//   //   Admin logged in  → /dashboard
//   //   Unauthenticated  → app/page.tsx (landing page)
//   // ============================================
//   if (pathname === "/") {
//     if (isAdmin) {
//       return NextResponse.redirect(
//         new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
//       );
//     }
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // ============================================
//   // STEP 4: AUTH routes — bounce away if already logged in
//   // /signin  /forgot-password  /reset-password  /reset-success  /verify-otp
//   // ============================================
//   if (matchesRoute(pathname, AUTH_ROUTES)) {
//     if (isAdmin) {
//       return NextResponse.redirect(
//         new URL(getRoleDefaultPath(ROLES.ADMIN), request.url),
//       );
//     }
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // ============================================
//   // STEP 5: Public-only routes
//   // /success
//   // ============================================
//   if (matchesRoute(pathname, PUBLIC_ONLY_ROUTES)) {
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // ============================================
//   // STEP 6: Everything else is PROTECTED — deny-by-default
//   // ============================================

//   // 6a. Not authenticated → /signin with return path
//   if (!isAuthenticated) {
//     const loginUrl = new URL("/signin", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // 6b. Missing role cookie
//   if (!userRole) {
//     const loginUrl = new URL("/signin", request.url);
//     loginUrl.searchParams.set("error", "missing_role");
//     return NextResponse.redirect(loginUrl);
//   }

//   // 6c. Universal protected — any authenticated role
//   if (matchesRoute(pathname, UNIVERSAL_PROTECTED_ROUTES)) {
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // 6d. Role-specific access
//   if (hasRoleAccess(pathname, userRole)) {
//     return withSecurityHeaders(NextResponse.next());
//   }

//   // 6e. Authenticated but no access → safe fallback
//   console.warn(`🚫 Access denied: role="${userRole}" tried "${pathname}"`);
//   return NextResponse.redirect(
//     new URL(getRoleDefaultPath(userRole), request.url),
//   );
// }

// // ============================================
// // MIDDLEWARE MATCHER
// // ============================================

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon\\.ico|favicon-96x96\\.png|manifest\\.json|manifest\\.webmanifest|sw\\.js|swe-worker|workbox|web-app-manifest|apple-touch-icon|icons/|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|mp4|mp3|pdf|csv|xml|txt|js)$).*)",
//   ],
// };


// ------------------------------------########------Production file below-------###########------------------------------------------
// proxy.ts — fitmate-ai | Next.js Role-Based Access Control Middleware
//
// ⚠️  SECURITY NOTE:
// JWT cryptographic verification is intentionally NOT done here.
// The backend API already verifies the JWT on every protected endpoint.
// This proxy is a routing guard only — it checks cookie presence + role.
//
// Project route map (from app/ file tree):
//
//   app/page.tsx                              → "/"          (root, dual behaviour)
//
//   app/(auth)/signin/page.tsx                → /signin
//   app/(auth)/forgot-password/page.tsx       → /forgot-password
//   app/(auth)/reset-password/page.tsx        → /reset-password
//   app/(auth)/reset-success/page.tsx         → /reset-success
//   app/(auth)/verify-otp/page.tsx            → /verify-otp
//   app/(auth)/success/page.tsx               → /success
//
//   app/(protected)/(shared)/profile          → /profile
//   app/(protected)/(shared)/settings         → /settings
//   app/(protected)/(shared)/notifications    → /notifications
//   app/(protected)/(shared)/privacy-policy   → /privacy-policy   ← INFO route
//
//   app/(protected)/(admin)/dashboard         → /dashboard
//   app/(protected)/(admin)/commission-tracking
//   app/(protected)/(admin)/order-management
//   app/(protected)/(admin)/payment-history
//   app/(protected)/(admin)/products
//   app/(protected)/(admin)/user-management
//
//   app/~offline/page.tsx                     → /~offline         ← PWA offline page
//   app/not-found.tsx                         → /404 / not-found
//   app/(protected)/[...notFound]/page.tsx    → catch-all inside protected

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
  const userRole = request.cookies.get("userRole")?.value ?? "";
  const isAuthenticated = !!accessToken;
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;

  // ============================================
  // STEP 2: INFO routes — always accessible, skip ALL auth logic
  // /privacy-policy  /terms  /about-us
  // ============================================
  if (matchesRoute(pathname, INFO_ROUTES)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // ============================================
  // STEP 3: Root "/" — dual behaviour
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

  // 6b. Authenticated but role cookie is missing / unrecognised
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
     *  - _next/image             Next.js image optimisation
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
