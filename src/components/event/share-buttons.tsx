"use client";

import { useState, useSyncExternalStore } from "react";

export function shareMessage(name: string, url: string) {
  return `❤️ Join us for ${name}!\n\nWatch and celebrate with us:\n${url}`;
}

const noop = () => () => {};

export function ShareButtons({ name, slug, className }: { name: string; slug: string; className: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);
  // origin is only known in the browser; falls back to a relative path during SSR
  const url = useSyncExternalStore(noop, () => `${window.location.origin}/event/${slug}`, () => `/event/${slug}`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(shareMessage(name, url))}`;
  const btn = `inline-flex items-center justify-center px-5 py-2.5 ${className}`;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" onClick={copy} className={btn}>
        {copied ? "✓ Copied" : "Copy Link"}
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={btn}>
        WhatsApp
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className={btn}>
        Facebook
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer" className={btn}>
        X
      </a>
      {canShare && (
        <button
          type="button"
          onClick={() => navigator.share({ title: name, text: shareMessage(name, url), url }).catch(() => {})}
          className={btn}
        >
          Share…
        </button>
      )}
    </div>
  );
}
