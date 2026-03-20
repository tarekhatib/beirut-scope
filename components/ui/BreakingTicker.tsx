import type { QuickUpdate } from "@/types";

type Props = {
  updates: QuickUpdate[];
};

export default function BreakingTicker({ updates }: Props) {
  if (!updates.length) return null;

  const hasBreaking = updates.some((u) => u.type === "BREAKING");
  // Duplicated for seamless CSS loop animation
  const items = [...updates, ...updates];

  return (
    <div className="flex items-stretch overflow-hidden border-b border-line" style={{ backgroundColor: "var(--accent)" }}>
      <div className="flex-shrink-0 flex items-center px-4 py-2 bg-black/20 z-10">
        <span className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {hasBreaking ? "⚡ Breaking" : "Latest"}
        </span>
      </div>

      <div className="overflow-hidden flex-1 relative">
        <div className="ticker-track flex items-center gap-0 py-2 whitespace-nowrap">
          {items.map((update, i) => (
            <span key={i} className="inline-flex items-center gap-6 text-white text-sm">
              {update.type === "BREAKING" && (
                <span className="text-white/70 font-semibold">BREAKING —</span>
              )}
              <span>{update.text}</span>
              <span className="text-white/40 mx-4 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
