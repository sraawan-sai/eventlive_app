"use client";

import type { TemplateTheme } from "@/lib/templates";
import type { SiteEvent } from "@/types/event";
import { LiveViewer } from "@/components/live/live-viewer";
import { useLang } from "./lang";

/** Live stream area of the public page. Viewers connect to LiveKit only while the stream is LIVE. */
export function LiveSection({ event, t }: { event: SiteEvent; t: TemplateTheme }) {
  const { tr } = useLang();
  return (
    <section id="live" className={`scroll-mt-16 ${t.section}`}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={t.sectionTitle}>{tr("liveStream")}</h2>
        <LiveViewer slug={event.slug} initialStatus={event.streamStatus} />
      </div>
    </section>
  );
}
