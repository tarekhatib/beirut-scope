import { prisma } from "@/lib/prisma";
import type { ArticleWithCategory } from "@/types";

const articleInclude = { category: true } as const;

export async function getArticles(options?: {
  categorySlug?: string;
  limit?: number;
  featured?: boolean;
}): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: {
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
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticlesByCategory(categorySlug: string, limit = 6): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { category: { slug: categorySlug } },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithCategory | null> {
  return prisma.article.findUnique({ where: { slug }, include: articleInclude });
}

export async function getFeaturedArticles(): Promise<ArticleWithCategory[]> {
  return prisma.article.findMany({
    where: { isFeatured: true },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
}

export async function incrementArticleViews(id: number): Promise<void> {
  await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
}
