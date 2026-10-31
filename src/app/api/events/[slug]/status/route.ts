import { NextResponse } from "next/server";
import { floodLimited } from "@/lib/request-guard";
import { clientIp } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { countViewers, roomNameFor } from "@/lib/livekit";
import { getStreamStatus } from "@/lib/live-state";

/** Public: live/offline/ended plus a basic viewer count. */
export async function GET(req: Request, ctx: RouteContext<"/api/events/[slug]/status">) {
  if (floodLimited(`status:${clientIp(req.headers)}`, 1500)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const { slug } = await ctx.params;
  const event = await db.event.findUnique({ where: { slug }, select: { id: true, status: true, tickerOn: true, tickerText: true } });
  if (!event || event.status === "DRAFT") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const status = await getStreamStatus(event.id);
  const viewers = status === "LIVE" ? await countViewers(roomNameFor(event.id)) : 0;
  const ticker = { on: event.tickerOn && !!event.tickerText, text: event.tickerText ?? "" };
  return NextResponse.json({ status, viewers, ticker }, { headers: { "Cache-Control": "no-store" } });
}
