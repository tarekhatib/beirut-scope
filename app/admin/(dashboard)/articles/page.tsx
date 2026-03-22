import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import ArticleActions from "@/components/admin/ArticleActions";

async function getAllArticles() {
  return prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}

export const metadata = { title: "Articles — Admin" };

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Articles</h1>
          <p className="text-sm text-ink-soft mt-1">{articles.length} total</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          + New article
        </Link>
      </div>

      <div className="bg-canvas border border-line rounded-xl overflow-hidden">
        {articles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-ink-soft text-sm">No articles yet.</p>
            <Link href="/admin/articles/new" className="text-accent text-sm hover:underline mt-2 inline-block">
              Create your first article
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {articles.map((article) => (
              <li key={article.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-ink truncate">{article.title}</p>
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {article.category.name} · {formatDate(article.publishedAt)} · {article.views} views
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <ArticleActions id={article.id} isFeatured={article.isFeatured} />
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="px-2 py-1 rounded text-xs font-medium text-ink-soft border border-line hover:text-accent hover:border-accent transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
