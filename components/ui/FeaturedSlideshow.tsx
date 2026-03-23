"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatDate } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types";

type Props = { articles: ArticleWithCategory[] };

const SNAP = "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function FeaturedSlideshow({ articles }: Props) {
  const n = articles.length;
  const [current, setCurrent] = useState(0);

  const currentRef = useRef(0);
  const pausedRef = useRef(false);
  const slideEls = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  // Tracks which slide is partially in view during a drag (for snap-back)
  const draggingIncoming = useRef<{ idx: number; side: 1 | -1 } | null>(null);

  // Initial layout: slide 0 at center, others stacked right (will be repositioned by go())
  const initPositions = () => {
    slideEls.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = "none";
      // Simple linear: 0 at center, rest to the right
      el.style.transform = `translateX(${i * 100}%)`;
    });
  };

  useLayoutEffect(() => {
    initPositions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * dir = +1 → going forward (next): incoming enters from RIGHT, outgoing exits LEFT
   * dir = -1 → going backward (prev): incoming enters from LEFT, outgoing exits RIGHT
   * fromDrag = true → incoming slide is already partially in view, skip pre-positioning
   */
  const go = (c: number, dir: 1 | -1, fromDrag = false) => {
    const prevC = currentRef.current;
    if (c === prevC) return;
    currentRef.current = c;

    if (!fromDrag) {
      // Instantly place incoming slide on the correct off-screen side
      const el = slideEls.current[c];
      if (el) {
        el.style.transition = "none";
        el.style.transform = `translateX(${dir * 100}%)`;
        el.getBoundingClientRect(); // force reflow so the transition fires
      }
    }

    // Animate: incoming → center, outgoing → off-screen in opposite direction
    slideEls.current.forEach((el, i) => {
      if (!el) return;
      if (i === c) {
        el.style.transition = SNAP;
        el.style.transform = "translateX(0%)";
      } else if (i === prevC) {
        el.style.transition = SNAP;
        el.style.transform = `translateX(${-dir * 100}%)`;
      }
      // Other slides: leave where they are (off-screen, not visible)
    });

    setCurrent(c); // triggers re-render for dots + text only
  };

  const prev = () => go((currentRef.current - 1 + n) % n, -1);
  const next = () => go((currentRef.current + 1) % n, +1);

  // Stable ref so the interval always calls the latest next()
  const nextRef = useRef(next);
  useEffect(() => { nextRef.current = next; });

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) nextRef.current();
    }, 6000);
    return () => clearInterval(id);
  }, [n]);

  // ── Touch handlers — direct DOM, no setState during drag ──────────────────

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    pausedRef.current = true;
    draggingIncoming.current = null;
    // Kill in-progress transitions so drag is instant
    slideEls.current.forEach((el) => { if (el) el.style.transition = "none"; });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dragPx = e.touches[0].clientX - touchStartX.current;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const c = currentRef.current;

      // Move current slide with finger
      const currEl = slideEls.current[c];
      if (currEl) currEl.style.transform = `translateX(${dragPx}px)`;

      if (dragPx > 0) {
        // Swiping right → revealing PREV (enters from left at -100%)
        const idx = (c - 1 + n) % n;
        draggingIncoming.current = { idx, side: -1 };
        const el = slideEls.current[idx];
        if (el) el.style.transform = `translateX(calc(-100% + ${dragPx}px))`;
      } else if (dragPx < 0) {
        // Swiping left → revealing NEXT (enters from right at +100%)
        const idx = (c + 1) % n;
        draggingIncoming.current = { idx, side: 1 };
        const el = slideEls.current[idx];
        if (el) el.style.transform = `translateX(calc(100% + ${dragPx}px))`;
      }
    });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    pausedRef.current = false;

    if (Math.abs(diff) > 50) {
      // Complete the swipe — incoming slide is already partially in view
      if (diff > 0) {
        go((currentRef.current - 1 + n) % n, -1, true);
      } else {
        go((currentRef.current + 1) % n, +1, true);
      }
    } else {
      // Snap back: current returns to center, incoming returns off-screen
      const c = currentRef.current;
      const currEl = slideEls.current[c];
      if (currEl) { currEl.style.transition = SNAP; currEl.style.transform = "translateX(0%)"; }
      if (draggingIncoming.current) {
        const { idx, side } = draggingIncoming.current;
        const el = slideEls.current[idx];
        if (el) { el.style.transition = SNAP; el.style.transform = `translateX(${side * 100}%)`; }
        draggingIncoming.current = null;
      }
    }
  };

  if (n === 0) return null;

  return (
    <div
      className="group grid grid-cols-1 lg:grid-cols-5 bg-card rounded-xl overflow-hidden border border-line hover:shadow-lg transition-shadow"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* ── Image carousel ───────────────────────────────────────────────── */}
      <div
        className="relative lg:col-span-3 aspect-video lg:aspect-auto overflow-hidden select-none"
        style={{ touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {articles.map((a, i) => (
          <div
            key={a.id}
            ref={(el) => { slideEls.current[i] = el; }}
            className="absolute inset-0"
            // No style prop for transform — useLayoutEffect + go() own it
          >
            <Link href={`/${a.category.slug}/${a.slug}`} className="block w-full h-full" draggable={false}>
              {a.coverImage ? (
                <Image
                  src={a.coverImage}
                  alt={a.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover pointer-events-none"
                  priority
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-line" />
              )}
            </Link>
          </div>
        ))}

        {n > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors focus:outline-none"
              aria-label="Previous"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors focus:outline-none"
              aria-label="Next"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {n > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  if (i !== currentRef.current) go(i, i > currentRef.current ? 1 : -1);
                }}
                className={`rounded-full transition-all duration-300 focus:outline-none ${
                  i === current ? "w-5 h-2 bg-accent" : "w-2 h-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Text — re-renders only when setCurrent fires ──────────────────── */}
      <div className="lg:col-span-2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 gap-3 lg:gap-4">
        <div className="flex items-center gap-3">
          <CategoryBadge name={articles[current].category.name} slug={articles[current].category.slug} />
          <span className="text-xs text-accent font-semibold uppercase tracking-wide">Featured</span>
        </div>
        <Link href={`/${articles[current].category.slug}/${articles[current].slug}`}>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-ink leading-tight hover:text-accent transition-colors">
            {articles[current].title}
          </h1>
        </Link>
        <p className="text-sm text-ink-muted">{formatDate(articles[current].publishedAt)}</p>
      </div>
    </div>
  );
}
