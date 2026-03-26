import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ArticleWithCategory } from "@/types";

const articleInclude = { category: true } as const;

export async function getArticles(options?: {
  categorySlug?: string;
  limit?: number;
  featured?: boolean;
}): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: {
      isDraft: false,
      ...(options?.categorySlug && { category: { slug: options.categorySlug } }),
      ...(options?.featured !== undefined && { isFeatured: options.featured }),
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: options?.limit,
  });
}

export async function getLatestArticles(limit = 10): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { isDraft: false },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticlesByCategory(categorySlug: string, limit = 6): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { isDraft: false, category: { slug: categorySlug } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithCategory | null> {
  return prisma.article.findUnique({ where: { slug, isDraft: false }, include: articleInclude });
}

export async function getFeaturedArticles(): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { isDraft: false, isFeatured: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRelatedArticles(categorySlug: string, excludeSlug: string, limit = 3): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { isDraft: false, category: { slug: categorySlug }, NOT: { slug: excludeSlug } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function searchArticles(query: string, limit = 20): Promise<ArticleWithCategory[]> {
  const pattern = `%${query}%`;
  const rows = await prisma.$queryRaw<Array<{
    id: number; title: string; titleAr: string; slug: string; content: Prisma.JsonValue;
    coverImage: string | null; isFeatured: boolean; isDraft: boolean;
    clicks: number; views: number; publishedAt: Date; updatedAt: Date; categoryId: number;
    cat_id: number; cat_name: string; cat_slug: string; cat_createdAt: Date; cat_updatedAt: Date;
  }>>`
    SELECT a.*,
           c.id          AS cat_id,
           c.name        AS cat_name,
           c.slug        AS cat_slug,
           c."createdAt" AS "cat_createdAt",
           c."updatedAt" AS "cat_updatedAt"
    FROM   "Article" a
    JOIN   "Category" c ON a."categoryId" = c.id
    WHERE  a."isDraft" = false
      AND (
            a.title         ILIKE ${pattern}
         OR c.name          ILIKE ${pattern}
         OR a.content::text ILIKE ${pattern}
          )
    ORDER BY a."publishedAt" DESC
    LIMIT  ${limit}
  `;

  return rows.map((r) => ({
    id: r.id, title: r.title, titleAr: r.titleAr, slug: r.slug, content: r.content,
    coverImage: r.coverImage, isFeatured: r.isFeatured, isDraft: r.isDraft,
    clicks: r.clicks, views: r.views, publishedAt: r.publishedAt,
    updatedAt: r.updatedAt, categoryId: r.categoryId,
    category: { id: r.cat_id, name: r.cat_name, slug: r.cat_slug, createdAt: r.cat_createdAt, updatedAt: r.cat_updatedAt },
  }));
}

export async function incrementArticleViews(id: number): Promise<void> {
  await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
}
