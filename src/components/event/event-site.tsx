"use client";

import Link from "next/link";
import { EVENT_TYPE_CONFIG, defaultCover, type EventType } from "@/lib/event-types";
import { formatDate, formatTime } from "@/lib/format";
import { getTemplate } from "@/lib/templates";
import type { SiteEvent } from "@/types/event";
import { LANG_LOCALE } from "@/lib/i18n";
import { Countdown } from "./countdown";
import { LangProvider, LangToggle, useLang } from "./lang";
import { MusicPlayer } from "./music-player";
import { LiveSection } from "./live-section";
import { ShareButtons } from "./share-buttons";
import { SponsorsSection } from "./sponsors-section";
import { PhotoGallery, VideoSection, WeddingCard } from "./media-sections";

/** Renders any event with any template: event data + template theme = website. */
export function EventSite({ event }: { event: SiteEvent }) {
  return (
    <LangProvider>
      <Site event={event} />
    </LangProvider>
  );
}

function Site({ event }: { event: SiteEvent }) {
  const { lang, tr, tagline } = useLang();
  const fmtDate = (d: string) => formatDate(d, LANG_LOCALE[lang]);
  const t = getTemplate(event.template);
  const cfg = EVENT_TYPE_CONFIG[event.type as EventType] ?? EVENT_TYPE_CONFIG.OTHER;
  const one = event.hostOne ?? "";
  const two = event.hostTwo ?? "";
  const card = event.media.find((m) => m.kind === "CARD");
  const photos = event.media.filter((m) => m.kind === "PHOTO");
  const videos = event.media.filter((m) => m.kind === "VIDEO");
  const music = event.media.find((m) => m.kind === "MUSIC");
  const timeRange = [formatTime(event.startTime), formatTime(event.endTime)].filter(Boolean).join(" – ");

  return (
    <div className={`${t.page} min-h-screen`}>
      {/* Nav */}
      <nav className={`sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur ${t.navBar}`}>
        <span className="truncate font-serif text-lg italic">{cfg.headline(one, two, event.name).replace("❤️", "&")}</span>
        <div className="hidden items-center gap-6 text-sm sm:flex">
          <a href="#top" className="hover:opacity-70">{tr("home")}</a>
          {event.schedule.length > 0 && <a href="#schedule" className="hover:opacity-70">{tr("schedule")}</a>}
          <a href="#live" className="hover:opacity-70">{tr("live")}</a>
          {photos.length > 0 && <a href="#gallery" className="hover:opacity-70">{tr("gallery")}</a>}
          {(event.venueName || event.venueAddress) && <a href="#venue" className="hover:opacity-70">{tr("venue")}</a>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LangToggle className={t.accent} />
          <a href="#share" className={`hidden px-4 py-1.5 text-sm sm:inline-flex ${t.buttonGhost}`}>{tr("share")}</a>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className={`relative flex ${t.heroWrap} items-center justify-center overflow-hidden px-5 py-16 text-center`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.coverImageUrl || defaultCover(event.type)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className={`absolute inset-0 ${t.heroOverlay}`} />
        <div className={`relative z-10 mx-auto max-w-4xl ${t.heroText}`}>
          <p className={t.tagline}>{tagline(event.type, cfg.tagline)}</p>
          <h1 className={`mt-5 ${t.headline}`}>{cfg.headline(one, two, event.name)}</h1>
          <p className={`mt-6 ${t.date}`}>{fmtDate(event.eventDate)}</p>
          <div className="mt-8">
            <Countdown date={event.eventDate} time={event.startTime} boxClass={t.countdownBox} />
          </div>
          <a href="#live" className={`mt-8 inline-flex px-6 py-3 ${t.button}`}>
            {tr("watchLive")}
          </a>
        </div>
      </header>

      {/* Details */}
      <section id="details" className={t.section}>
        <div className="mx-auto max-w-3xl">
          <h2 className={t.sectionTitle}>{tr("details")}</h2>
          {event.description && <p className={`mb-8 whitespace-pre-line text-center text-lg leading-relaxed ${t.muted}`}>{event.description}</p>}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={t.card}>
              <p className={`text-xs uppercase tracking-widest ${t.accent}`}>{tr("date")}</p>
              <p className="mt-1 font-semibold">{fmtDate(event.eventDate)}</p>
            </div>
            {timeRange && (
              <div className={t.card}>
                <p className={`text-xs uppercase tracking-widest ${t.accent}`}>{tr("time")}</p>
                <p className="mt-1 font-semibold">{timeRange}</p>
              </div>
            )}
            {(event.venueName || event.venueAddress) && (
              <div id="venue" className={`scroll-mt-20 ${t.card}`}>
                <p className={`text-xs uppercase tracking-widest ${t.accent}`}>{tr("venue")}</p>
                {event.venueName && <p className="mt-1 font-semibold">{event.venueName}</p>}
                {event.venueAddress && <p className={`text-sm ${t.muted}`}>{event.venueAddress}</p>}
                {(event.venueName || event.venueAddress) && (
                  <a
                    className={`mt-2 inline-block text-sm underline ${t.accent}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [event.venueName, event.venueAddress].filter(Boolean).join(", "),
                    )}`}
                  >
                    {tr("openMaps")}
                  </a>
                )}
              </div>
            )}
          </div>
          {(event.venueName || event.venueAddress) && (
            <iframe
              title="Venue map"
              loading="lazy"
              className="mt-6 h-64 w-full rounded-xl border-0"
              src={`https://www.google.com/maps?q=${encodeURIComponent([event.venueName, event.venueAddress].filter(Boolean).join(", "))}&output=embed`}
            />
          )}
        </div>
      </section>

      {card && <WeddingCard card={card} t={t} />}

      {/* Schedule */}
      {event.schedule.length > 0 && (
        <section id="schedule" className={t.section}>
          <div className="mx-auto max-w-2xl">
            <h2 className={t.sectionTitle}>{tr("schedule")}</h2>
            <ol className="relative ml-2 border-l-2 border-current/20 pl-6">
              {event.schedule.map((s) => (
                <li key={s.id} className="relative pb-8 last:pb-0">
                  <span className={`absolute -left-[31px] top-1.5 size-3 rounded-full bg-current ring-4 ring-current/20 ${t.accent}`} aria-hidden />
                  <p className={`text-sm font-semibold ${t.accent}`}>
                    {formatTime(s.startTime)}
                    {s.endTime && ` – ${formatTime(s.endTime)}`}
                  </p>
                  <p className="text-lg font-semibold">{s.title}</p>
                  {s.description && <p className={`text-sm ${t.muted}`}>{s.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <LiveSection event={event} t={t} />

      {videos.length > 0 && <VideoSection videos={videos} t={t} />}
      {photos.length > 0 && <PhotoGallery photos={photos} t={t} />}

      {event.sponsors.length > 0 && <SponsorsSection sponsors={event.sponsors} t={t} />}

      {/* Share */}
      <section id="share" className={t.section}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={t.sectionTitle}>{tr("shareTitle")}</h2>
          <ShareButtons name={event.name} slug={event.slug} className={t.buttonGhost} />
        </div>
      </section>

      {music && <MusicPlayer url={music.url} className={t.button} />}

      <footer className={`py-8 text-center text-xs ${t.muted}`}>
        {tr("madeWith")} <Link href="/" className="underline">Eventra</Link>
      </footer>
    </div>
  );
}
