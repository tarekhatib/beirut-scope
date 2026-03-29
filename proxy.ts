import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";

function setCorsHeaders(res: NextResponse, origin: string | null) {
  const allowed =
    !ALLOWED_ORIGIN || (origin && origin === ALLOWED_ORIGIN)
      ? (origin ?? "*")
      : "";

  if (allowed) {
    res.headers.set("Access-Control-Allow-Origin", allowed);
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");
    if (allowed !== "*") {
      res.headers.set("Vary", "Origin");
    }
  }

  return res;
}

export default auth(function proxy(req: NextRequest & { auth: unknown }) {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");

  // CORS preflight for API routes
  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return setCorsHeaders(new NextResponse(null, { status: 204 }), origin);
  }

  // CORS headers for API responses
  if (pathname.startsWith("/api/")) {
    return setCorsHeaders(NextResponse.next(), origin);
  }

  // Admin route protection
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
