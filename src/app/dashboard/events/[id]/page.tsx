import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { toDateInput } from "@/lib/format";
import type { EventType } from "@/lib/event-types";
import { SiteHeader } from "@/components/site-header";
import { EditEventForm } from "@/components/event/edit-form";
import { QrCard } from "@/components/event/qr-card";
import { SponsorManager } from "@/components/event/sponsor-manager";
import { MediaManager } from "@/components/event/media-manager";
import { publicUrlFor, storageConfig } from "@/lib/storage";
import type { MediaKindName } from "@/lib/media";

export const metadata = { title: "Edit event — Eventra" };

export default async function EditEventPage({ params }: PageProps<"/dashboard/events/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const e = await db.event.findUnique({
    where: { id },
    include: { schedule: { orderBy: { startTime: "asc" } }, media: { orderBy: { createdAt: "asc" } }, sponsors: { orderBy: { createdAt: "asc" } } },
  });
  if (!e || e.userId !== user.id) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <EditEventForm
          id={e.id}
          status={e.status}
          initial={{
            type: e.type as EventType,
            name: e.name,
            hostOne: e.hostOne ?? "",
            hostTwo: e.hostTwo ?? "",
            description: e.description ?? "",
            eventDate: toDateInput(e.eventDate),
            startTime: e.startTime ?? "",
            endTime: e.endTime ?? "",
            venueName: e.venueName ?? "",
            venueAddress: e.venueAddress ?? "",
            coverImageUrl: e.coverImageUrl ?? "",
            template: e.template,
            slug: e.slug,
          }}
          schedule={e.schedule.map((s) => ({ title: s.title, description: s.description ?? "", startTime: s.startTime, endTime: s.endTime ?? "" }))}
        />
        <section className="mt-10">
          <h2 className="mb-1 font-serif text-2xl font-bold">Photos, card &amp; video</h2>
          <p className="mb-4 text-sm text-foreground/60">Shown on your public event website. Uploads save immediately.</p>
          <MediaManager
            eventId={e.id}
            configured={!!storageConfig()}
            initial={e.media.map((m) => ({
              id: m.id,
              kind: m.kind as MediaKindName,
              url: publicUrlFor(m.key),
              mimeType: m.mimeType,
              sizeBytes: m.sizeBytes,
            }))}
          />
        </section>
        <section className="mt-10">
          <QrCard slug={e.slug} name={e.name} />
        </section>
        <section className="mt-10">
          <SponsorManager
            eventId={e.id}
            storageReady={!!storageConfig()}
            initial={e.sponsors.map((s) => ({
              id: s.id,
              name: s.name,
              tier: s.tier,
              websiteUrl: s.websiteUrl,
              logoUrl: s.logoKey ? publicUrlFor(s.logoKey) : null,
      display: s.display === "photo" ? "photo" : "logo",
            }))}
          />
        </section>
      </main>
    </>
  );
}
