"use client";

import { useTransition } from "react";
import { deleteAd, toggleAdActive } from "@/server/actions/ads";

interface Props {
  id: number;
  isActive: boolean;
}

export default function AdActions({ id, isActive }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => toggleAdActive(id, !isActive));
  }

  function handleDelete() {
    if (!confirm("Delete this ad? This cannot be undone.")) return;
    startTransition(() => deleteAd(id));
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
          isActive
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-surface text-ink-soft hover:bg-line"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-ink-soft hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
