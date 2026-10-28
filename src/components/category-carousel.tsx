"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EventType } from "@/lib/event-types";

export interface Category {
  type: EventType;
  label: string;
  emoji: string;
  text: string;
  image: string;
}

/** Event category cards with arrows and page dots. Scrolls natively (swipe on phones), arrows and dots step by one page. */
export function CategoryCarousel({ items }: { items: Category[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const total = Math.max(1, Math.ceil((el.scrollWidth - 4) / el.clientWidth));
    setPages(total);
    const max = el.scrollWidth - el.clientWidth;
    setPage(max <= 0 ? 0 : Math.min(total - 1, Math.round((el.scrollLeft / max) * (total - 1))));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  }

  function goTo(i: number) {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: pages > 1 ? (max * i) / (pages - 1) : 0, behavior: "smooth" });
  }

  const arrow =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-xl text-foreground shadow-lg ring-1 ring-black/5 transition hover:scale-105 disabled:opacity-0 sm:grid";

  return (
    <div className="relative mx-auto max-w-[1500px]">
      <button type="button" aria-label="Previous categories" onClick={() => go(-1)} disabled={page === 0} className={`${arrow} left-1`}>
        ‹
      </button>
      <button type="button" aria-label="More categories" onClick={() => go(1)} disabled={page >= pages - 1} className={`${arrow} right-1`}>
        ›
      </button>

      <ul
        ref={track}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-8 pt-2 [scrollbar-width:none] sm:px-14 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c) => (
          <li key={c.type} className="w-[62%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)] xl:w-[calc((100%-6rem)/7)]">
            <Link
              href={`/create-event?type=${c.type}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-2.5 text-center shadow-[0_8px_30px_rgba(214,40,75,0.08)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(214,40,75,0.16)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" className="aspect-[10/11] w-full rounded-2xl object-cover" />
              <span className="mx-auto mt-3 grid size-14 place-items-center rounded-full bg-tint text-2xl">{c.emoji}</span>
              <span className="mt-2 text-base font-bold">{c.label}</span>
              <span className="mt-1 px-2 text-xs leading-snug text-foreground/60">{c.text}</span>
              <span className="mx-auto mb-1 mt-auto grid size-10 place-items-center rounded-full bg-tint pt-0 text-lg text-brand transition group-hover:bg-brand group-hover:text-white" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="flex justify-center gap-2" role="tablist" aria-label="Category pages">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${i === page ? "w-6 bg-brand" : "w-2.5 bg-black/15 hover:bg-black/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
