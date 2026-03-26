"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type ArticlePayload = {
  title: string;
  slug?: string;
  content: object;
  categoryId: number;
  coverImage?: string;
  isFeatured?: boolean;
  isDraft?: boolean;
  publishedAt?: Date;
};

export async function createArticle(payload: ArticlePayload) {
  const slug = payload.slug?.trim() || slugify(payload.title);

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`Slug "${slug}" is already in use. Choose a different one.`);
  }

  const article = await prisma.article.create({
    data: {
      title: payload.title,
      slug,
      content: payload.content,
      categoryId: payload.categoryId,
      coverImage: payload.coverImage ?? null,
      isFeatured: payload.isFeatured ?? false,
      isDraft: payload.isDraft ?? false,
      publishedAt: payload.publishedAt ?? new Date(),
    },
    include: { category: true },
  });

  revalidatePath("/");
  revalidatePath(`/${article.category.slug}/${article.slug}`);
  revalidatePath("/admin");

  return article;
}

export async function updateArticle(
  id: number,
  payload: Partial<ArticlePayload>
) {
  const data: Record<string, unknown> = {};

  if (payload.title !== undefined) data.title = payload.title;
  if (payload.content !== undefined) data.content = payload.content;
  if (payload.categoryId !== undefined) data.categoryId = payload.categoryId;
  if (payload.coverImage !== undefined) data.coverImage = payload.coverImage;
  if (payload.isFeatured !== undefined) data.isFeatured = payload.isFeatured;
  if (payload.isDraft !== undefined) data.isDraft = payload.isDraft;
  if (payload.publishedAt !== undefined) data.publishedAt = payload.publishedAt;

  if (payload.slug !== undefined) {
    const newSlug = payload.slug.trim();
    const existing = await prisma.article.findUnique({ where: { slug: newSlug } });
    if (existing && existing.id !== id) {
      throw new Error(`Slug "${newSlug}" is already in use. Choose a different one.`);
    }
    data.slug = newSlug;
  }

  const article = await prisma.article.update({
    where: { id },
    data,
    include: { category: true },
  });

  revalidatePath("/");
  revalidatePath(`/${article.category.slug}/${article.slug}`);
  revalidatePath("/admin");

  return article;
}

export async function deleteArticle(id: number) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
