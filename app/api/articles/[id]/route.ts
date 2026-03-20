import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, categoryId, coverImage, isFeatured, publishedAt } =
      body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = slugify(title);
    }
    if (content !== undefined) data.content = content;
    if (categoryId !== undefined) data.categoryId = Number(categoryId);
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (publishedAt !== undefined) data.publishedAt = new Date(publishedAt);

    const article = await prisma.article.update({
      where: { id: Number(id) },
      data,
      include: { category: true },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.article.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
