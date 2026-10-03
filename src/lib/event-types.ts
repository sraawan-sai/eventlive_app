export const EVENT_TYPES = [
  "WEDDING",
  "BIRTHDAY",
  "ANNIVERSARY",
  "RELIGIOUS",
  "CORPORATE",
  "CONCERT",
  "GRADUATION",
  "OTHER",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventTypeConfig {
  label: string;
  emoji: string;
  /** Labels for the two optional name fields; null hides the field. */
  hostOneLabel: string | null;
  hostTwoLabel: string | null;
  nameLabel: string;
  dateLabel: string;
  /** Builds a default event name from the host names. */
  suggestName: (one: string, two: string) => string;
  /** Shown big on the hero. */
  headline: (one: string, two: string, name: string) => string;
  tagline: string;
}

const join = (...parts: string[]) => parts.filter(Boolean).join(" ");

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  WEDDING: {
    label: "Wedding",
    emoji: "💍",
    hostOneLabel: "Bride Name",
    hostTwoLabel: "Groom Name",
    nameLabel: "Website title",
    dateLabel: "Wedding Date",
    // hostOne = bride, hostTwo = groom; groom is listed first, e.g. "Sravan & Kuslatha"
    suggestName: (bride, groom) => (bride || groom ? `${groom}${bride && groom ? " & " : ""}${bride} Wedding` : ""),
    headline: (bride, groom, n) => (bride && groom ? `${groom} ❤️ ${bride}` : n),
    tagline: "Our Wedding",
  },
  BIRTHDAY: {
    label: "Birthday",
    emoji: "🎂",
    hostOneLabel: "Birthday Person",
    hostTwoLabel: null,
    nameLabel: "Event title",
    dateLabel: "Birthday Date",
    suggestName: (a) => (a ? `${a}'s Birthday` : ""),
    headline: (a, _b, n) => a || n,
    tagline: "Birthday Celebration",
  },
  ANNIVERSARY: {
    label: "Anniversary",
    emoji: "🥂",
    hostOneLabel: "Partner One",
    hostTwoLabel: "Partner Two",
    nameLabel: "Event title",
    dateLabel: "Anniversary Date",
    suggestName: (a, b) => (a || b ? join(a, a && b ? "&" : "", b, "Anniversary") : ""),
    headline: (a, b, n) => (a && b ? `${a} ❤️ ${b}` : n),
    tagline: "Anniversary Celebration",
  },
  RELIGIOUS: {
    label: "Religious Event",
    emoji: "🕉️",
    hostOneLabel: "Host / Family",
    hostTwoLabel: null,
    nameLabel: "Event title",
    dateLabel: "Event Date",
    suggestName: () => "",
    headline: (_a, _b, n) => n,
    tagline: "You are warmly invited",
  },
  CORPORATE: {
    label: "Corporate Event",
    emoji: "🏢",
    hostOneLabel: "Organisation",
    hostTwoLabel: null,
    nameLabel: "Event title",
    dateLabel: "Event Date",
    suggestName: () => "",
    headline: (_a, _b, n) => n,
    tagline: "Corporate Event",
  },
  CONCERT: {
    label: "Concert",
    emoji: "🎤",
    hostOneLabel: "Artist / Band",
    hostTwoLabel: null,
    nameLabel: "Concert title",
    dateLabel: "Concert Date",
    suggestName: (a) => (a ? `${a} Live` : ""),
    headline: (_a, _b, n) => n,
    tagline: "Live in Concert",
  },
  GRADUATION: {
    label: "Graduation",
    emoji: "🎓",
    hostOneLabel: "Graduate",
    hostTwoLabel: null,
    nameLabel: "Event title",
    dateLabel: "Graduation Date",
    suggestName: (a) => (a ? `${a}'s Graduation` : ""),
    headline: (a, _b, n) => a || n,
    tagline: "Graduation Celebration",
  },
  OTHER: {
    label: "Other",
    emoji: "🎉",
    hostOneLabel: "Host",
    hostTwoLabel: null,
    nameLabel: "Event title",
    dateLabel: "Event Date",
    suggestName: () => "",
    headline: (_a, _b, n) => n,
    tagline: "Join us to celebrate",
  },
};

export function eventTypeLabel(type: string): string {
  return EVENT_TYPE_CONFIG[type as EventType]?.label ?? "Event";
}

const COVER_BY_TYPE: Record<EventType, string> = {
  WEDDING: "wedding",
  ANNIVERSARY: "wedding",
  BIRTHDAY: "birthday",
  GRADUATION: "birthday",
  CORPORATE: "corporate",
  CONCERT: "corporate",
  RELIGIOUS: "celebration",
  OTHER: "celebration",
};

/** Illustrated default cover used when an event has no cover image URL. */
export function defaultCover(type: string): string {
  return `/images/cover-${COVER_BY_TYPE[type as EventType] ?? "celebration"}.svg`;
}

/** Sponsors suit public/community events; personal events (wedding, birthday…) show the invitation card instead. */
const SPONSOR_TYPES: readonly string[] = ["RELIGIOUS", "CORPORATE", "CONCERT", "OTHER"];
export const supportsSponsors = (type: string) => SPONSOR_TYPES.includes(type);

export const cardLabel = (type: string) => (type === "WEDDING" ? "Wedding card" : "Invitation card");
