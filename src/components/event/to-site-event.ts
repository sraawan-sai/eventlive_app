import { EVENT_TYPE_CONFIG } from "@/lib/event-types";
import type { EventFormValues } from "./event-fields";
import type { SiteEvent } from "@/types/event";

export function valuesToSiteEvent(v: EventFormValues, slug: string, schedule: SiteEvent["schedule"] = []): SiteEvent {
  return {
    name: v.name || EVENT_TYPE_CONFIG[v.type].label,
    slug,
    type: v.type,
    hostOne: v.hostOne || null,
    hostTwo: v.hostTwo || null,
    description: v.description || null,
    eventDate: v.eventDate || new Date().toISOString().slice(0, 10),
    startTime: v.startTime || null,
    endTime: v.endTime || null,
    venueName: v.venueName || null,
    venueAddress: v.venueAddress || null,
    coverImageUrl: v.coverImageUrl || null,
    template: v.template,
    schedule,
    media: [],
    sponsors: [],
    streamStatus: "OFFLINE",
  };
}
