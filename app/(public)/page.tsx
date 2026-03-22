import Link from "next/link";
import Image from "next/image";
import BreakingTicker from "@/components/ui/BreakingTicker";
import ArticleCard from "@/components/ui/ArticleCard";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { getQuickUpdates } from "@/server/queries/updates";
import { getFeaturedArticle, getLatestArticles, getArticlesByCategory } from "@/server/queries/articles";
import { getCategories } from "@/server/queries/categories";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [updates, featured, latest, categories] = await Promise.all([
    getQuickUpdates(10),
    getFeaturedArticle(),
    getLatestArticles(6),
    getCategories(),
  ]);

  const categorySections = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      articles: await getArticlesByCategory(cat.slug, 3),
    }))
  );

  return (
    <>
      <BreakingTicker updates={updates} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">

        {featured && (
          <section>
            {/* div wrapper prevents <a> nesting with CategoryBadge link inside */}
            <div className="group grid grid-cols-1 lg:grid-cols-5 gap-0 bg-card rounded-xl overflow-hidden border border-line hover:shadow-lg transition-shadow">
              <Link
                href={`/${featured.category.slug}/${featured.slug}`}
                className="relative lg:col-span-3 aspect-video lg:aspect-auto min-h-64 overflow-hidden block"
              >
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-line" />
                )}
              </Link>

              <div className="lg:col-span-2 flex flex-col justify-center p-6 lg:p-8 gap-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge name={featured.category.name} slug={featured.category.slug} />
                  <span className="text-xs text-accent font-semibold uppercase tracking-wide">Featured</span>
                </div>
                <Link href={`/${featured.category.slug}/${featured.slug}`}>
                  <h1 className="text-2xl lg:text-3xl font-bold text-ink leading-tight group-hover:text-accent transition-colors">
                    {featured.title}
                  </h1>
                </Link>
                <p className="text-sm text-ink-muted">{formatDate(featured.publishedAt)}</p>
              </div>
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h2 className="text-xl font-bold text-ink">Latest News</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {categorySections
          .filter((s) => s.articles.length > 0)
          .map(({ category, articles }) => (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-accent rounded-full" />
                  <h2 className="text-xl font-bold text-ink">{category.name}</h2>
                </div>
                <Link
                  href={`/${category.slug}`}
                  className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  See all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          ))}

        {!featured && latest.length === 0 && (
          <div className="text-center py-24 text-ink-muted">
            <p className="text-lg">No articles published yet.</p>
          </div>
        )}

      </main>
    </>
  );
}
