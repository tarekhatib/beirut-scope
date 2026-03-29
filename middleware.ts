import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";

function setCorsHeaders(res: NextResponse, origin: string | null) {
  const allowed =
    !ALLOWED_ORIGIN || (origin && origin === ALLOWED_ORIGIN)
      ? origin ?? "*"
      : "";

  if (allowed) {
    res.headers.set("Access-Control-Allow-Origin", allowed);
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Max-Age", "86400");
    if (allowed !== "*") {
      res.headers.set("Vary", "Origin");
    }
  }

  return res;
}

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");

  // Handle CORS preflight for API routes
  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflight = new NextResponse(null, { status: 204 });
    return setCorsHeaders(preflight, origin);
  }

  // Protect admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = (req as { auth?: { user?: unknown } }).auth;
    if (!session?.user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply CORS headers to all API responses
  if (pathname.startsWith("/api/")) {
    const res = NextResponse.next();
    return setCorsHeaders(res, origin);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
