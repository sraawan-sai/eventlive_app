import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { countViewers, createLiveKitToken, livekitConfig, roomNameFor } from "@/lib/livekit";
import { planState } from "@/lib/plan";
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
    const plan = await planState(event.id);
    if (plan.exceeded) {
      return NextResponse.json(
        { error: `You have used all ${plan.limits.maxLiveMinutes} minutes of live time in your ${plan.limits.name} package. Upgrade to keep streaming.`, code: "limit_time" },
        { status: 403 },
      );
    }
    await ensureStream(event.id);
    const left = plan.exempt ? undefined : plan.limitSeconds - plan.usedSeconds + 30;
    const t = await createLiveKitToken({ room, role: "broadcaster", userId: session.user.id, name: session.user.name ?? undefined, maxTtlSeconds: left });
    return NextResponse.json({ token: t.token, url: t.url }, { headers: { "Cache-Control": "no-store" } });
  }

  // Viewer: anyone, but only for a published event that is currently live.
  if (event.status === "DRAFT") return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if ((await getStreamStatus(event.id)) !== "LIVE") {
    return NextResponse.json({ error: "The live stream has not started yet." }, { status: 409 });
  }
  // Package viewer cap: guests above the limit are turned away (they are not told about upgrades).
  const plan = await planState(event.id);
  if (!plan.exempt && (await countViewers(room)) >= plan.limits.maxViewers) {
    return NextResponse.json({ error: "This stream is full right now.", code: "stream_full" }, { status: 409 });
  }
  const left = plan.exempt ? undefined : plan.limitSeconds - plan.usedSeconds + 30;
  const t = await createLiveKitToken({ room, role: "viewer", maxTtlSeconds: left });
  return NextResponse.json({ token: t.token, url: t.url }, { headers: { "Cache-Control": "no-store" } });
}
