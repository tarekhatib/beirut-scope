"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type ArticlePayload = {
  title: string;
  titleAr?: string;
  slug?: string;
  content: object;
  categoryId: number;
  coverImage?: string;
  isFeatured?: boolean;
  isDraft?: boolean;
  publishedAt?: Date;
};

function isBlob(url: string | null | undefined): url is string {
  return !!url && url.includes(".blob.vercel-storage.com");
}

function extractBlobUrls(content: unknown): string[] {
  const urls: string[] = [];
  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;
    if (n.type === "image" && typeof n.attrs === "object" && n.attrs !== null) {
      const src = (n.attrs as Record<string, unknown>).src;
      if (isBlob(src as string)) urls.push(src as string);
    }
    if (Array.isArray(n.content)) n.content.forEach(walk);
  }
  walk(content);
  return urls;
}

async function deleteBlobUrls(urls: string[]) {
  const targets = urls.filter(isBlob);
  if (targets.length > 0) await del(targets);
}

export async function createArticle(payload: ArticlePayload) {
  const slug = payload.slug?.trim() || slugify(payload.title);

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`Slug "${slug}" is already in use. Choose a different one.`);
  }

  const article = await prisma.article.create({
    data: {
      title: payload.title,
      titleAr: payload.titleAr ?? "",
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
  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) throw new Error("Article not found.");

  const data: Record<string, unknown> = {};

  if (payload.title !== undefined) data.title = payload.title;
  if (payload.titleAr !== undefined) data.titleAr = payload.titleAr;
  if (payload.content !== undefined) data.content = payload.content;
  if (payload.categoryId !== undefined) data.categoryId = payload.categoryId;
  if (payload.isFeatured !== undefined) data.isFeatured = payload.isFeatured;
  if (payload.isDraft !== undefined) data.isDraft = payload.isDraft;
  if (payload.publishedAt !== undefined) data.publishedAt = payload.publishedAt;

  if (payload.coverImage !== undefined) {
    data.coverImage = payload.coverImage || null;
    if (isBlob(current.coverImage) && current.coverImage !== payload.coverImage) {
      await deleteBlobUrls([current.coverImage]);
    }
  }

  if (payload.content !== undefined) {
    const oldUrls = extractBlobUrls(current.content);
    const newUrls = new Set(extractBlobUrls(payload.content));
    const removed = oldUrls.filter((u) => !newUrls.has(u));
    await deleteBlobUrls(removed);
  }

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
  const article = await prisma.article.findUnique({ where: { id } });
  if (article) {
    const toDelete: string[] = [];
    if (isBlob(article.coverImage)) toDelete.push(article.coverImage);
    toDelete.push(...extractBlobUrls(article.content));
    await deleteBlobUrls(toDelete);
  }

  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
