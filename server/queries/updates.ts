import { prisma } from "@/lib/prisma";
import type { QuickUpdate } from "@/types";

function cutoff() {
  return new Date(Date.now() - 48 * 60 * 60 * 1000);
}

export async function getQuickUpdates(limit = 20): Promise<QuickUpdate[]> {
  return prisma.quickUpdate.findMany({
    where: { createdAt: { gte: cutoff() } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBreakingUpdates(limit = 10): Promise<QuickUpdate[]> {
  return prisma.quickUpdate.findMany({
    where: { isBreaking: true, createdAt: { gte: cutoff() } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllUpdatesAdmin(limit = 50): Promise<QuickUpdate[]> {
  return prisma.quickUpdate.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
