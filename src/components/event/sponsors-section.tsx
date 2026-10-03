"use client";

import type { TemplateTheme } from "@/lib/templates";
import type { SponsorItem } from "@/lib/actions/sponsors";
import { useLang } from "./lang";

function Body({ s }: { s: SponsorItem }) {
  const photo = s.display === "photo" && s.logoUrl;
  return (
    <>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logoUrl!} alt={s.name} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
      ) : (
        <div className="grid h-20 w-full place-items-center">
          {s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logoUrl} alt={s.name} loading="lazy" className="max-h-20 max-w-full object-contain" />
          ) : (
            <span className="font-serif text-lg font-semibold">{s.name}</span>
          )}
        </div>
      )}
      {(photo || s.logoUrl) && <p className="mt-2 text-sm font-semibold">{s.name}</p>}
      {s.tier && <p className="text-xs opacity-70">{s.tier}</p>}
    </>
  );
}

export function SponsorsSection({ sponsors, t }: { sponsors: SponsorItem[]; t: TemplateTheme }) {
  const { tr } = useLang();
  return (
    <section id="sponsors" className={`scroll-mt-16 ${t.section}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={t.sectionTitle}>{tr("sponsors")}</h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {sponsors.map((s) => (
            <li key={s.id} className={`flex flex-col items-center text-center ${s.display === "photo" ? "md:col-span-1" : ""} ${t.card}`}>
              {s.websiteUrl ? (
                <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="block w-full">
                  <Body s={s} />
                </a>
              ) : (
                <Body s={s} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
