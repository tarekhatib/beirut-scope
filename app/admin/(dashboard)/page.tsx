import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  const [totalArticles, featuredArticles, totalUpdates, totalCategories, recentArticles] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { isFeatured: true } }),
      prisma.quickUpdate.count(),
      prisma.category.count(),
      prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
        take: 5,
        include: { category: true },
      }),
    ]);

  return { totalArticles, featuredArticles, totalUpdates, totalCategories, recentArticles };
}

export default async function AdminDashboard() {
  const { totalArticles, featuredArticles, totalUpdates, totalCategories, recentArticles } =
    await getStats();

  const stats = [
    { label: "Total Articles", value: totalArticles, href: "/admin/articles" },
    { label: "Featured", value: featuredArticles, href: "/admin/articles" },
    { label: "Quick Updates", value: totalUpdates, href: "/admin/updates" },
    { label: "Categories", value: totalCategories, href: null },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-soft mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-canvas border border-line rounded-xl p-5">
            <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
            {stat.href && (
              <Link
                href={stat.href}
                className="text-xs text-accent hover:underline mt-2 inline-block"
              >
                View all →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="bg-canvas border border-line rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-sm font-semibold text-ink">Recent Articles</h2>
          <Link href="/admin/articles/new" className="text-xs font-medium text-accent hover:underline">
            + New article
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {recentArticles.map((article) => (
            <li key={article.id} className="flex items-center justify-between px-6 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{article.title}</p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {article.category.name} ·{" "}
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="ml-4 shrink-0 text-xs text-ink-soft hover:text-accent transition-colors"
              >
                Edit
              </Link>
            </li>
          ))}
          {recentArticles.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-ink-soft">
              No articles yet.{" "}
              <Link href="/admin/articles/new" className="text-accent hover:underline">
                Create one
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
