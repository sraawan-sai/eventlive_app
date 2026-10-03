// Shared (client + server) media rules.
export const MEDIA_KINDS = ["PHOTO", "CARD", "VIDEO", "MUSIC"] as const;
/** Kinds where a new upload replaces the old one. */
export const SINGLE_KINDS: readonly string[] = ["CARD", "MUSIC"];
export type MediaKindName = (typeof MEDIA_KINDS)[number];

const MB = 1024 * 1024;

export const MEDIA_RULES: Record<
  MediaKindName,
  { label: string; types: string[]; maxBytes: number; maxCount: number; hint: string }
> = {
  PHOTO: {
    label: "Photos",
    types: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 10 * MB,
    maxCount: 30,
    hint: "JPG, PNG or WebP, up to 10 MB each (max 30).",
  },
  CARD: {
    label: "Wedding card",
    types: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 10 * MB,
    maxCount: 1,
    hint: "JPG, PNG or WebP, up to 10 MB. Uploading a new card replaces the old one.",
  },
  MUSIC: {
    label: "Background music",
    types: ["audio/mpeg", "audio/mp4", "audio/aac", "audio/wav", "audio/x-m4a", "audio/ogg"],
    maxBytes: 20 * MB,
    maxCount: 1,
    hint: "MP3 or M4A, up to 20 MB. Use music you have the right to play. Guests only hear it if they tap play.",
  },
  VIDEO: {
    label: "Videos",
    types: ["video/mp4", "video/webm", "video/quicktime"],
    maxBytes: 500 * MB,
    maxCount: 3,
    hint: "MP4 recommended (H.264), up to 500 MB each (max 3).",
  },
};

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};
export const extFor = (mime: string) => EXT[mime] ?? "bin";

export interface MediaItem {
  id: string;
  kind: MediaKindName;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export const SPONSOR_RULE = {
  types: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * MB,
  maxCount: 30,
  hint: "PNG, JPG or WebP logo, up to 5 MB.",
};
