import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createLiveKitToken, livekitConfig, roomNameFor } from "@/lib/livekit";
import { ensureStream, getStreamStatus } from "@/lib/live-state";

const bodySchema = z.object({
  slug: z.string().min(1).max(80),
  // A *request* only. Broadcaster rights are granted solely after the ownership check below.
  role: z.enum(["broadcaster", "viewer"]),
});

export async function POST(req: Request) {
  if (!livekitConfig()) {
    return NextResponse.json({ error: "Live streaming is not configured on this server." }, { status: 503 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { slug, role } = parsed.data;

  const event = await db.event.findUnique({
    where: { slug },
    select: { id: true, userId: true, status: true },
  });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const room = roomNameFor(event.id);

  if (role === "broadcaster") {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    if (session.user.id !== event.userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    await ensureStream(event.id);
    const t = await createLiveKitToken({ room, role: "broadcaster", userId: session.user.id, name: session.user.name ?? undefined });
    return NextResponse.json({ token: t.token, url: t.url }, { headers: { "Cache-Control": "no-store" } });
  }

  // Viewer: anyone, but only for a published event that is currently live.
  if (event.status === "DRAFT") return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if ((await getStreamStatus(event.id)) !== "LIVE") {
    return NextResponse.json({ error: "The live stream has not started yet." }, { status: 409 });
  }
  const t = await createLiveKitToken({ room, role: "viewer" });
  return NextResponse.json({ token: t.token, url: t.url }, { headers: { "Cache-Control": "no-store" } });
}
