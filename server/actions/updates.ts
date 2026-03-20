"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { UpdateType } from "@/types";

export async function createQuickUpdate(text: string, type: UpdateType = "NORMAL") {
  if (!text.trim()) {
    throw new Error("Update text cannot be empty");
  }

  const update = await prisma.quickUpdate.create({
    data: { text: text.trim(), type },
  });

  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin");

  return update;
}

export async function deleteQuickUpdate(id: number) {
  await prisma.quickUpdate.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin");
}
