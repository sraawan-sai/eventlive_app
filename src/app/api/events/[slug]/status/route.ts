import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { countViewers, roomNameFor } from "@/lib/livekit";
import { getStreamStatus } from "@/lib/live-state";

/** Public: live/offline/ended plus a basic viewer count. */
export async function GET(_req: Request, ctx: RouteContext<"/api/events/[slug]/status">) {
  const { slug } = await ctx.params;
  const event = await db.event.findUnique({ where: { slug }, select: { id: true, status: true, tickerOn: true, tickerText: true } });
  if (!event || event.status === "DRAFT") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const status = await getStreamStatus(event.id);
  const viewers = status === "LIVE" ? await countViewers(roomNameFor(event.id)) : 0;
  const ticker = { on: event.tickerOn && !!event.tickerText, text: event.tickerText ?? "" };
  return NextResponse.json({ status, viewers, ticker }, { headers: { "Cache-Control": "no-store" } });
}
