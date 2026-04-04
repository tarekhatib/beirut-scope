import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/types";

export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
});

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { slug },
  });
}
