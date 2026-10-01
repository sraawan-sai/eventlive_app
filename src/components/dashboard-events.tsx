"use client";

import { useState } from "react";
import { ButtonLink, Card } from "@/components/ui";
import { CopyLinkButton } from "@/components/copy-link-button";
import { StatusBadge } from "@/components/status-badge";
import { getTemplate } from "@/lib/templates";
import { defaultCover } from "@/lib/event-types";

export interface DashboardEvent {
  id: string;
  name: string;
  slug: string;
  type: string;
  typeLabel: string;
  dateLabel: string;
  venue: string | null;
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "ENDED";
  template: string;
  coverImageUrl: string | null;
}

const TABS = [
  { key: "ALL", label: "All Events" },
  { key: "LIVE", label: "Live" },
  { key: "DRAFT", label: "Drafts" },
  { key: "ENDED", label: "Ended" },
] as const;

export function DashboardEvents({ events }: { events: DashboardEvent[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("ALL");
  const [q, setQ] = useState("");
  const shown = events.filter((e) => (tab === "ALL" || e.status === tab) && e.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" className="flex gap-5 overflow-x-auto border-b border-black/10">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm font-semibold ${tab === t.key ? "border-brand text-brand" : "border-transparent text-foreground/60 hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search events…"
          aria-label="Search events"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-brand sm:w-56"
        />
      </div>

      {events.length === 0 ? (
        <Card className="mt-6 py-14 text-center">
          <p className="text-4xl">🎊</p>
          <p className="mt-3 font-semibold">No events yet</p>
          <p className="mb-5 text-sm text-foreground/60">Create your first event website in a few minutes.</p>
          <ButtonLink href="/create-event">+ Create Event</ButtonLink>
        </Card>
      ) : shown.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">No events match.</p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {shown.map((e) => {
            const t = getTemplate(e.template);
            return (
              <li key={e.id}>
                <Card className="flex gap-4 p-4">
                  <div
                    className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[1]}, ${t.swatch[2]})` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.coverImageUrl || defaultCover(e.type)} alt="" className="h-full w-full object-cover" />
                    {e.status === "LIVE" && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">● LIVE</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold">{e.name}</h3>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="text-xs text-foreground/60">{e.typeLabel} · {e.dateLabel}</p>
                    {e.venue && <p className="truncate text-xs text-foreground/60">📍 {e.venue}</p>}
                    <div className="mt-1.5 flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate text-[11px] text-foreground/60">/event/{e.slug}</code>
                      <CopyLinkButton path={`/event/${e.slug}`} />
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <ButtonLink href={`/event/${e.slug}`} variant="secondary" className="px-3 py-1.5 text-xs">View Website</ButtonLink>
                      <ButtonLink href={`/dashboard/events/${e.id}`} variant="secondary" className="px-3 py-1.5 text-xs">Edit</ButtonLink>
                      <ButtonLink href={`/event/${e.slug}/live`} className="px-3 py-1.5 text-xs">Go Live</ButtonLink>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
