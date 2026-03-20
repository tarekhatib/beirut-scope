import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get("limit");

    const updates = await prisma.quickUpdate.findMany({
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit, 10) : 20,
    });

    return NextResponse.json(updates);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, type } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const update = await prisma.quickUpdate.create({
      data: {
        text: text.trim(),
        type: type === "BREAKING" ? "BREAKING" : "NORMAL",
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create update" },
      { status: 500 }
    );
  }
}
