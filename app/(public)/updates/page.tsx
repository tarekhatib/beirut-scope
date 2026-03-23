import type { Metadata } from "next";
import { getQuickUpdates } from "@/server/queries/updates";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Live Updates",
  description: "Latest breaking news and quick updates from Beirut Scope.",
};

function formatUpdateTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const d = new Date(date);
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  if (dDate.getTime() === today.getTime()) return `Today, ${time}`;
  if (dDate.getTime() === yesterday.getTime()) return `Yesterday, ${time}`;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + `, ${time}`;
}

export default async function UpdatesPage() {
  const updates = await getQuickUpdates(100);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-accent rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-ink">Live Updates</h1>
          <p className="text-sm text-ink-muted mt-1">Breaking news and quick updates</p>
        </div>
      </div>

      {updates.length === 0 ? (
        <p className="text-ink-muted text-center py-20">No active updates.</p>
      ) : (
        <ol className="relative border-l-2 border-line space-y-0">
          {updates.map((update) => (
            <li key={update.id} className="ml-6 pb-8">
              <span
                className="absolute -left-2.25 mt-1.5 w-4 h-4 rounded-full border-2 border-page"
                style={{ backgroundColor: update.isBreaking ? "var(--accent)" : "var(--border)" }}
              />
              <div className="bg-card border border-line rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {update.isBreaking && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-accent px-2 py-0.5 rounded">
                      Breaking
                    </span>
                  )}
                  <time className="text-xs text-ink-muted">
                    {formatUpdateTime(new Date(update.createdAt))}
                  </time>
                </div>
                <p className="text-ink leading-relaxed text-right" dir="rtl">{update.textAr}</p>
                <p className="text-ink-soft leading-relaxed mt-2 border-t border-line pt-2">{update.textEn}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
