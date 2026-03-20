import { prisma } from "@/lib/prisma";
import type { QuickUpdate } from "@/types";

export async function getQuickUpdates(limit = 20): Promise<QuickUpdate[]> {
  return prisma.quickUpdate.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
