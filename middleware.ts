import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/penjual", "/pembeli"];

function hasSupabaseSessionCookie(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  return cookieHeader
    .split(";")
    .some(
      (cookie) =>
        cookie.trim().startsWith("sb-") && cookie.includes("auth-token"),
    );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedRoute && !hasSupabaseSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/penjual/:path*", "/pembeli/:path*"],
};
