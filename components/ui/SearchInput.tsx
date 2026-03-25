"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="search"
        defaultValue={defaultValue}
        placeholder="Search articles..."
        autoFocus
        className="flex-1 px-4 py-2.5 rounded-lg border border-line bg-card text-ink placeholder:text-ink-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
