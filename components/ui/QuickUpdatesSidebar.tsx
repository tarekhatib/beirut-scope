import Link from "next/link";
import type { QuickUpdate } from "@/types";

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

type Props = { updates: QuickUpdate[] };

export default function QuickUpdatesSidebar({ updates }: Props) {
  if (!updates.length) return null;

  return (
    <div className="flex flex-col bg-card border border-line rounded-xl overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-line shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Live Updates</h2>
      </div>

      <div className="divide-y divide-line">
        {updates.map((update) => (
          <div key={update.id} className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {update.isBreaking && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-accent px-1.5 py-0.5 rounded">
                  Breaking
                </span>
              )}
              <time className="text-[11px] text-ink-muted">
                {formatUpdateTime(new Date(update.createdAt))}
              </time>
            </div>
            <p className="text-sm text-ink leading-relaxed text-right" dir="rtl">{update.textAr}</p>
            <p className="text-sm text-ink-soft leading-relaxed mt-1">{update.textEn}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-line shrink-0">
        <Link href="/updates" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
          View all updates →
        </Link>
      </div>
    </div>
  );
}
