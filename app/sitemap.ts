import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://beirutscope.com";
const PER_SITEMAP = 5000;

export async function generateSitemaps() {
  const count = await prisma.article.count({ where: { isDraft: false } });
  const total = Math.max(1, Math.ceil(count / PER_SITEMAP));
  return Array.from({ length: total }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { isDraft: false },
    select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    orderBy: { publishedAt: "desc" },
    skip: id * PER_SITEMAP,
    take: PER_SITEMAP,
  });

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/${a.category.slug}/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  if (id !== 0) return articleEntries;

  const categories = await prisma.category.findMany({ select: { slug: true } });

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/updates`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${BASE}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...articleEntries,
  ];
}
