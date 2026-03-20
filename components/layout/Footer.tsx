import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/server/queries/categories";

export default async function Footer() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="space-y-3">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Beirut Scope"
                width={140}
                height={36}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              Breaking news and in-depth coverage from Lebanon and the world.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">Sections</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/${cat.slug}`} className="text-sm text-ink-footer hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/updates" className="text-sm text-ink-footer hover:text-accent transition-colors">
                  Live Updates
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-ink-muted">© {year} Beirut Scope. All rights reserved.</p>
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </div>
    </footer>
  );
}
