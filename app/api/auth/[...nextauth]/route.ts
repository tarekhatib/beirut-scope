import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  return handlers.POST(req);
}
