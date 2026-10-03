import { db } from "@/lib/db";
import { toDateInput } from "@/lib/format";
import { publicUrlFor } from "@/lib/storage";
import type { SiteEvent } from "@/types/event";

export async function getSiteEventBySlug(slug: string) {
  const e = await db.event.findUnique({
    where: { slug },
    include: { schedule: { orderBy: { startTime: "asc" } }, stream: true, media: { orderBy: { createdAt: "asc" } }, sponsors: { orderBy: { createdAt: "asc" } } },
  });
  if (!e) return null;
  const site: SiteEvent = {
    name: e.name,
    slug: e.slug,
    type: e.type,
    hostOne: e.hostOne,
    hostTwo: e.hostTwo,
    description: e.description,
    eventDate: toDateInput(e.eventDate),
    startTime: e.startTime,
    endTime: e.endTime,
    venueName: e.venueName,
    venueAddress: e.venueAddress,
    coverImageUrl: e.coverImageUrl,
    template: e.template,
    schedule: e.schedule.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    media: e.media.map((m) => ({
      id: m.id,
      kind: m.kind,
      url: publicUrlFor(m.key),
      mimeType: m.mimeType,
      sizeBytes: m.sizeBytes,
    })),
    sponsors: e.sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      tier: s.tier,
      websiteUrl: s.websiteUrl,
      logoUrl: s.logoKey ? publicUrlFor(s.logoKey) : null,
      display: s.display === "photo" ? "photo" : "logo",
    })),
    streamStatus: e.stream?.status ?? "OFFLINE",
  };
  return { record: e, site };
}
