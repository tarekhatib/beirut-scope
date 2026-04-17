import { prisma } from "@/lib/prisma";
import AdForm from "@/components/admin/AdForm";

export const metadata = { title: "New Ad — Admin" };

export default async function NewAdPage() {
  const articles = await prisma.article.findMany({
    where: { isDraft: false },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">New ad</h1>
      <AdForm articles={articles} />
    </div>
  );
}
