import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/server/queries/categories";

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-header border-b border-line shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Beirut Scope"
              width={392}
              height={100}
              priority
              className="h-11 w-auto dark:invert"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="px-3 py-1.5 text-sm font-medium text-ink-soft hover:text-accent transition-colors rounded"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <details className="md:hidden group relative">
            <summary className="list-none cursor-pointer p-2 text-ink-soft hover:text-accent transition-colors">
              <svg className="w-6 h-6 group-open:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className="w-6 h-6 hidden group-open:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </summary>

            <nav className="absolute right-0 top-full mt-1 w-48 bg-card border border-line rounded-lg shadow-lg py-1 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className="block px-4 py-2 text-sm text-ink-soft hover:text-accent hover:bg-page transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </details>

        </div>
      </div>
    </header>
  );
}
