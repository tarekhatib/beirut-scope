import { getCategories } from "@/server/queries/categories";
import ArticleEditor from "@/components/admin/ArticleEditorWrapper";

export const metadata = { title: "New Article — Admin" };

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">New article</h1>
      <ArticleEditor categories={categories} />
    </div>
  );
}
