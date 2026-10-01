import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MEDIA_KINDS, MEDIA_RULES, extFor } from "@/lib/media";
import { presignUpload, storageConfig } from "@/lib/storage";

const bodySchema = z.object({
  eventId: z.string().min(1),
  kind: z.enum(MEDIA_KINDS),
  contentType: z.string().min(1).max(100),
  size: z.number().int().positive(),
});

/** Step 1 of an upload: owner-only. Validates type/size/limits and returns a presigned PUT URL. */
export async function POST(req: Request) {
  if (!storageConfig()) return NextResponse.json({ error: "File storage is not configured on this server." }, { status: 503 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { eventId, kind, contentType, size } = parsed.data;

  const event = await db.event.findUnique({ where: { id: eventId }, select: { userId: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const rule = MEDIA_RULES[kind];
  if (!rule.types.includes(contentType)) {
    return NextResponse.json({ error: `Unsupported file type. ${rule.hint}` }, { status: 415 });
  }
  if (size > rule.maxBytes) {
    return NextResponse.json({ error: `File is too large. ${rule.hint}` }, { status: 413 });
  }
  if (kind !== "CARD") {
    const count = await db.eventMedia.count({ where: { eventId, kind } });
    if (count >= rule.maxCount) {
      return NextResponse.json({ error: `You can add up to ${rule.maxCount} ${rule.label.toLowerCase()}.` }, { status: 409 });
    }
  }

  const key = `events/${eventId}/${kind.toLowerCase()}-${crypto.randomUUID()}.${extFor(contentType)}`;
  const uploadUrl = await presignUpload(key, contentType, size);
  return NextResponse.json({ uploadUrl, key });
}
