"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-8xl font-black text-accent mb-4">500</p>
      <h1 className="text-2xl font-bold text-ink mb-2">Something went wrong</h1>
      <p className="text-ink-muted mb-8">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
