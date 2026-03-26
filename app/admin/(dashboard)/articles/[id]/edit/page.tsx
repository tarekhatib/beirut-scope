import { getCategories } from "@/server/queries/categories";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditorWrapper";

export const metadata = { title: "Edit Article — Admin" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id: Number(id) } }),
    getCategories(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">Edit article</h1>
      <ArticleEditor
        categories={categories}
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          content: article.content as object,
          categoryId: article.categoryId,
          coverImage: article.coverImage,
          isFeatured: article.isFeatured,
          isDraft: article.isDraft,
        }}
      />
    </div>
  );
}
