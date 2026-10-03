"use client";

import { useEffect, useState } from "react";
import type { TemplateTheme } from "@/lib/templates";
import type { MediaItem } from "@/lib/media";
import { useLang } from "./lang";

export function WeddingCard({ card, t }: { card: MediaItem; t: TemplateTheme }) {
  const { tr } = useLang();
  return (
    <section id="card" className={`scroll-mt-16 ${t.section}`}>
      <div className="mx-auto max-w-md text-center">
        <h2 className={t.sectionTitle}>{tr("invitation")}</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.url} alt="Invitation card" loading="lazy" className="mx-auto w-full rounded-lg shadow-xl" />
        <a href={card.url} download target="_blank" rel="noopener noreferrer" className={`mt-5 inline-flex px-5 py-2.5 ${t.buttonGhost}`}>
          {tr("downloadCard")}
        </a>
      </div>
    </section>
  );
}

export function VideoSection({ videos, t }: { videos: MediaItem[]; t: TemplateTheme }) {
  const { tr } = useLang();
  return (
    <section id="videos" className={`scroll-mt-16 ${t.section}`}>
      <div className="mx-auto max-w-3xl">
        <h2 className={t.sectionTitle}>{tr("video")}</h2>
        <div className="space-y-6">
          {videos.map((v) => (
            <video
              key={v.id}
              src={`${v.url}#t=0.1`}
              controls
              preload="metadata"
              playsInline
              className="aspect-video w-full rounded-2xl bg-black"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PhotoGallery({ photos, t }: { photos: MediaItem[]; t: TemplateTheme }) {
  const { tr } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, photos.length]);

  return (
    <section id="gallery" className={`scroll-mt-16 ${t.section}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={t.sectionTitle}>{tr("gallery")}</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {photos.map((p, i) => (
            <li key={p.id}>
              <button type="button" onClick={() => setOpen(i)} className="block w-full overflow-hidden rounded-lg" aria-label={`Open photo ${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" loading="lazy" className="aspect-square w-full object-cover transition hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open].url} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-white">✕</button>
          {photos.length > 1 && (
            <>
              <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + photos.length) % photos.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-2xl text-white">‹</button>
              <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % photos.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-2xl text-white">›</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
