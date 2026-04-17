import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdById } from "@/server/queries/ads";
import AdForm from "@/components/admin/AdForm";

export const metadata = { title: "Edit Ad — Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditAdPage({ params }: Props) {
  const { id } = await params;
  const adId = parseInt(id);
  if (isNaN(adId)) notFound();

  const [ad, articles] = await Promise.all([
    getAdById(adId),
    prisma.article.findMany({
      where: { isDraft: false },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!ad) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">Edit ad</h1>
      <AdForm articles={articles} ad={ad} />
    </div>
  );
}
