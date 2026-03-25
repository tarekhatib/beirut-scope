import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleContent from "@/components/article/ArticleContent";
import ShareButtons from "@/components/article/ShareButtons";
import ViewTracker from "@/components/article/ViewTracker";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { getArticleBySlug } from "@/server/queries/articles";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: `${article.title} — ${article.category.name}`,
    openGraph: {
      title: article.title,
      description: `${article.title} — ${article.category.name}`,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      ...(article.coverImage && { images: [{ url: article.coverImage }] }),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // Redirect guard: canonical category must match
  if (article.category.slug !== categorySlug) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${article.category.slug}`} className="hover:text-accent transition-colors">
          {article.category.name}
        </Link>
        <span>/</span>
        <span className="text-ink-soft truncate max-w-50">{article.title}</span>
      </nav>

      {/* Category + meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />
        <time className="text-xs text-ink-muted">{formatDate(article.publishedAt)}</time>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-6">
        {article.title}
      </h1>

      {/* Share buttons */}
      <div className="mb-8">
        <ShareButtons title={article.title} />
      </div>

      {/* Cover image */}
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

      {/* Divider */}
      <div className="h-px bg-line mb-8" />

      <div id="article-body">
        <ArticleContent content={article.content as Parameters<typeof ArticleContent>[0]["content"]} />
      </div>
      <ViewTracker slug={article.slug} />

      {/* Footer meta */}
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
  );
}
