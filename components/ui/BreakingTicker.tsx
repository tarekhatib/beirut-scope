import type { QuickUpdate } from "@/types";

type Props = { updates: QuickUpdate[] };

export default function BreakingTicker({ updates }: Props) {
  if (!updates.length) return null;

  const items = [...updates, ...updates];

  return (
    <div className="flex items-stretch overflow-hidden border-b border-line" style={{ backgroundColor: "var(--accent)" }}>
      <div className="shrink-0 flex items-center px-3 sm:px-4 py-2 bg-black/20 z-10">
        <span className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          <span className="sm:hidden">⚡</span>
          <span className="hidden sm:inline">⚡ Breaking</span>
        </span>
      </div>

      <div className="overflow-hidden flex-1 relative">
        <div className="ticker-track flex items-center py-2 whitespace-nowrap">
          {items.map((update, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-white text-sm">
              <span>{update.textEn}</span>
              <span className="text-white/40 select-none">|</span>
              <span dir="rtl">{update.textAr}</span>
              <span className="text-white/30 mx-4 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
