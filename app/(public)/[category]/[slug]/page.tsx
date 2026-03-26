import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleContent from "@/components/article/ArticleContent";
import ShareButtons from "@/components/article/ShareButtons";
import ViewTracker from "@/components/article/ViewTracker";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ArticleCard from "@/components/ui/ArticleCard";
import { getArticleBySlug, getRelatedArticles } from "@/server/queries/articles";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 60;

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const images = article.coverImage
    ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }]
    : undefined;

  return {
    title: article.title,
    description: `${article.title} — ${article.category.name}`,
    openGraph: {
      title: article.title,
      description: `${article.title} — ${article.category.name}`,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: `${article.title} — ${article.category.name}`,
      ...(images && { images: [article.coverImage!] }),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const [article, related] = await Promise.all([
    getArticleBySlug(slug),
    getRelatedArticles(categorySlug, slug, 3),
  ]);

  if (!article) notFound();
  if (article.category.slug !== categorySlug) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    image: article.coverImage ? [article.coverImage] : undefined,
    articleSection: article.category.name,
    publisher: {
      "@type": "Organization",
      name: "Beirut Scope",
      url: "https://beirutscope.com",
    },
  };

  return (
    <>
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-ink-muted mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${article.category.slug}`} className="hover:text-accent transition-colors">
          {article.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink-soft truncate max-w-50">{article.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />
        <time className="text-xs text-ink-muted">{formatDate(article.publishedAt)}</time>
        <span className="text-xs text-ink-muted">·</span>
        <span className="text-xs text-ink-muted">{readingTime(article.content)} min read</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-6" dir="rtl">
        {article.titleAr || article.title}
      </h1>

      <div className="mb-8">
        <ShareButtons title={article.title} />
      </div>

      {article.coverImage && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="h-px bg-line mb-8" />

      <div id="article-body">
        <ArticleContent content={article.content as Parameters<typeof ArticleContent>[0]["content"]} />
      </div>
      <ViewTracker slug={article.slug} />

      <div className="mt-12 pt-6 border-t border-line flex items-center justify-between">
        <Link
          href={`/${article.category.slug}`}
          className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
        >
          ← More in {article.category.name}
        </Link>
        {article.updatedAt > article.publishedAt && (
          <span className="text-xs text-ink-muted">
            Updated {formatDate(article.updatedAt)}
          </span>
        )}
      </div>

    </main>

    {related.length > 0 && (
      <section className={`mx-auto px-4 sm:px-6 lg:px-8 pb-16 ${related.length >= 3 ? "max-w-6xl" : "max-w-3xl"}`}>
        <div className="border-t border-line pt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-xl font-bold text-ink">More in {article.category.name}</h2>
          </div>
          <div className={`grid gap-5 ${related.length === 1 ? "grid-cols-1" : related.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>
    )}
    </>
  );
}
