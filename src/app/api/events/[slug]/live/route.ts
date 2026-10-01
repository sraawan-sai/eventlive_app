import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { closeRoom, roomNameFor } from "@/lib/livekit";
import { endStream, heartbeat, startStream } from "@/lib/live-state";

const bodySchema = z.object({ action: z.enum(["start", "heartbeat", "stop"]) });

/** Owner-only: mark the stream live / alive / ended. */
export async function POST(req: Request, ctx: RouteContext<"/api/events/[slug]/live">) {
  const { slug } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const event = await db.event.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  switch (parsed.data.action) {
    case "start":
      await startStream(event.id);
      break;
    case "heartbeat":
      await heartbeat(event.id);
      break;
    case "stop":
      await endStream(event.id);
      await closeRoom(roomNameFor(event.id));
      break;
  }
  return NextResponse.json({ ok: true });
}
