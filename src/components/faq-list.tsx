"use client";

import { useLang } from "@/components/event/lang";
import { FAQ } from "@/lib/faq";

/** Questions that open and close, in the visitor's language. `limit` shows only the first few. */
export function FaqList({ limit }: { limit?: number }) {
  const { lang } = useLang();
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(214,40,75,0.08)] ring-1 ring-black/5">
      {items.map((item) => (
        <details key={item.q.en} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold hover:bg-black/[0.02] sm:px-6 [&::-webkit-details-marker]:hidden">
            <span>{item.q[lang]}</span>
            <span
              className="grid size-7 shrink-0 place-items-center rounded-full bg-tint text-lg leading-none text-brand transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-foreground/70 sm:px-6 sm:text-base">{item.a[lang]}</p>
        </details>
      ))}
    </div>
  );
}
