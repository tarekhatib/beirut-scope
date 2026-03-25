import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(`view:${ip}:${slug}`, 5, 60_000)) {
    return new NextResponse(null, { status: 429 });
  }

  try {
    await prisma.article.update({
      where: { slug, isDraft: false },
      data: { views: { increment: 1 } },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
