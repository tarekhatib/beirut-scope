import type { Metadata } from "next";
import { getQuickUpdates } from "@/server/queries/updates";
import { formatDate } from "@/lib/utils";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Live Updates",
  description: "Latest breaking news and quick updates from Beirut Scope.",
};

export default async function UpdatesPage() {
  const updates = await getQuickUpdates(100);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-accent rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-ink">Live Updates</h1>
          <p className="text-sm text-ink-muted mt-1">
            Latest breaking news and quick updates
          </p>
        </div>
      </div>

      {/* Updates list */}
      {updates.length === 0 ? (
        <p className="text-ink-muted text-center py-20">No updates yet.</p>
      ) : (
        <ol className="relative border-l-2 border-line space-y-0">
          {updates.map((update) => (
            <li key={update.id} className="ml-6 pb-8">
              {/* Timeline dot */}
              <span
                className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full border-2 border-card"
                style={{
                  backgroundColor:
                    update.type === "BREAKING" ? "var(--accent)" : "var(--border)",
                }}
              />

              <div className="bg-card border border-line rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  {update.type === "BREAKING" && (
                    <span className="text-xs font-bold uppercase tracking-widest text-white bg-accent px-2 py-0.5 rounded">
                      Breaking
                    </span>
                  )}
                  <time className="text-xs text-ink-muted">
                    {formatDate(update.createdAt)}
                  </time>
                </div>
                <p className="text-ink leading-relaxed">{update.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
