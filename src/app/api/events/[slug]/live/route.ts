import { crossSiteBlocked, forbidden } from "@/lib/request-guard";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { closeRoom, roomNameFor } from "@/lib/livekit";
import { endStream, heartbeat, startStream, stopForLimit } from "@/lib/live-state";
import { planState, toUsage } from "@/lib/plan";

const bodySchema = z.object({ action: z.enum(["start", "heartbeat", "stop"]) });

/** Owner-only: mark the stream live / alive / ended. */
export async function POST(req: Request, ctx: RouteContext<"/api/events/[slug]/live">) {
  if (crossSiteBlocked(req)) return forbidden();
  const { slug } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const event = await db.event.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const state = await planState(event.id);
  const upgradeMsg = `You have used all ${state.limits.maxLiveMinutes} minutes of live time in your ${state.limits.name} package. Upgrade to keep streaming.`;

  switch (parsed.data.action) {
    case "start":
      if (state.exceeded) return NextResponse.json({ error: upgradeMsg, code: "limit_time", usage: toUsage(state) }, { status: 403 });
      await startStream(event.id);
      break;
    case "heartbeat": {
      if (state.exceeded) {
        // Time is up: end the stream for everyone and tell the broadcaster to stop.
        await stopForLimit(event.id);
        const after = await planState(event.id);
        return NextResponse.json({ ok: true, stop: true, code: "limit_time", error: upgradeMsg, usage: toUsage(after) });
      }
      await heartbeat(event.id);
      return NextResponse.json({ ok: true, stop: false, usage: toUsage(state) });
    }
    case "stop":
      await endStream(event.id);
      await closeRoom(roomNameFor(event.id));
      break;
  }
  return NextResponse.json({ ok: true, usage: toUsage(await planState(event.id)) });
}
