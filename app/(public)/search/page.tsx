import type { Metadata } from "next";
import ArticleCard from "@/components/ui/ArticleCard";
import SearchInput from "@/components/ui/SearchInput";
import { searchArticles } from "@/server/queries/articles";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query.length >= 2 ? await searchArticles(query) : [];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">Search</h1>

      <SearchInput defaultValue={query} />

      {query.length >= 2 && (
        <div className="mt-8">
          <p className="text-sm text-ink-muted mb-6">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
          </p>
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {query.length < 2 && query.length > 0 && (
        <p className="mt-8 text-sm text-ink-muted">Type at least 2 characters to search.</p>
      )}
    </main>
  );
}
