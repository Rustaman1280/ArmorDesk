import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("armordesk_token")?.value;
  const { pathname } = request.nextUrl;

  // Static assets, Next internals, and API endpoints are bypassed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public unauthenticated routes
  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/edit";

  // Force logout/switch account parameter bypass
  if (pathname === "/login" && (request.nextUrl.searchParams.has("switch") || request.nextUrl.searchParams.has("logout"))) {
    const response = NextResponse.next();
    response.cookies.delete("armordesk_token");
    response.cookies.delete("armordesk_user");
    response.cookies.delete("armordesk_tenant");
    return response;
  }

  // 1. Unauthenticated user trying to access protected dashboard routes
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated user visiting /login or /register -> send to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
