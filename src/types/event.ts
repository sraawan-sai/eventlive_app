export interface SiteEvent {
  name: string;
  slug: string;
  type: string;
  hostOne: string | null;
  hostTwo: string | null;
  description: string | null;
  eventDate: string; // YYYY-MM-DD
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  coverImageUrl: string | null;
  template: string;
  schedule: { id: string; title: string; description: string | null; startTime: string; endTime: string | null }[];
  media: import("@/lib/media").MediaItem[];
  sponsors: import("@/lib/actions/sponsors").SponsorItem[];
  streamStatus: "OFFLINE" | "LIVE" | "ENDED";
}
