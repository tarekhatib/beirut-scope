import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categorySlug = searchParams.get("category") ?? undefined;
    const limit = searchParams.get("limit");
    const featured = searchParams.get("featured");

    const articles = await prisma.article.findMany({
      where: {
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(featured !== null && { isFeatured: featured === "true" }),
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, categoryId, coverImage, isFeatured, publishedAt } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "title, content, and categoryId are required" }, { status: 400 });
    }

    const slug = slugify(title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${slug}" already exists. Use a different title.` }, { status: 409 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        categoryId: Number(categoryId),
        coverImage: coverImage ?? null,
        isFeatured: isFeatured ?? false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: { category: true },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
