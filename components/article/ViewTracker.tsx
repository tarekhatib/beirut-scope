"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Track click (article opened) — once per session
    const clickKey = `clicked_${slug}`;
    if (!sessionStorage.getItem(clickKey)) {
      sessionStorage.setItem(clickKey, "1");
      fetch(`/api/track/${slug}/click`, { method: "POST" });
    }

    // Track view (30% scroll through article body) — once per session
    const viewKey = `viewed_${slug}`;
    if (sessionStorage.getItem(viewKey)) return;

    const articleEl = document.getElementById("article-body");
    if (!articleEl) return;

    const onScroll = () => {
      const rect = articleEl.getBoundingClientRect();
      const scrolledPast = -rect.top;
      const progress = scrolledPast / articleEl.offsetHeight;
      if (progress >= 0.3) {
        sessionStorage.setItem(viewKey, "1");
        fetch(`/api/track/${slug}/view`, { method: "POST" });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  return null;
}
