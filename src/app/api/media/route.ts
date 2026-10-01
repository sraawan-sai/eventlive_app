import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MEDIA_KINDS, MEDIA_RULES } from "@/lib/media";
import { deleteObjects, objectSize, publicUrlFor, storageConfig } from "@/lib/storage";

const bodySchema = z.object({
  eventId: z.string().min(1),
  kind: z.enum(MEDIA_KINDS),
  key: z.string().min(1).max(300),
  contentType: z.string().min(1).max(100),
});

/** Step 3 of an upload: after the browser PUT succeeded, verify the object and record it. */
export async function POST(req: Request) {
  if (!storageConfig()) return NextResponse.json({ error: "File storage is not configured on this server." }, { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { eventId, kind, key, contentType } = parsed.data;

  const event = await db.event.findUnique({ where: { id: eventId }, select: { userId: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  // Key must be one we issued for this event and kind (prevents registering arbitrary objects).
  if (!key.startsWith(`events/${eventId}/${kind.toLowerCase()}-`)) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }
  const rule = MEDIA_RULES[kind];
  if (!rule.types.includes(contentType)) return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });

  const size = await objectSize(key);
  if (size === null) return NextResponse.json({ error: "Upload not found. Please try again." }, { status: 400 });
  if (size > rule.maxBytes) {
    await deleteObjects([key]);
    return NextResponse.json({ error: "File is too large." }, { status: 413 });
  }

  // One wedding card per event: a new one replaces the old one.
  let removed: string[] = [];
  if (kind === "CARD") {
    const old = await db.eventMedia.findMany({ where: { eventId, kind: "CARD" }, select: { key: true } });
    removed = old.map((o) => o.key);
    await db.eventMedia.deleteMany({ where: { eventId, kind: "CARD" } });
  }
  const media = await db.eventMedia.create({ data: { eventId, kind, key, mimeType: contentType, sizeBytes: size } });
  if (removed.length) await deleteObjects(removed);

  return NextResponse.json({
    media: { id: media.id, kind: media.kind, url: publicUrlFor(media.key), mimeType: media.mimeType, sizeBytes: media.sizeBytes },
  });
}
