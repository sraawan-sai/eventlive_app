import "server-only";
import { db } from "@/lib/db";
import { HEARTBEAT_TIMEOUT_MS, roomNameFor } from "@/lib/livekit";

/**
 * Current stream status for an event. If the stream says LIVE but the broadcaster
 * stopped sending heartbeats, it is marked ENDED so guests are not left on a dead stream.
 */
export async function getStreamStatus(eventId: string): Promise<"OFFLINE" | "LIVE" | "ENDED"> {
  const stream = await db.liveStream.findUnique({ where: { eventId } });
  if (!stream) return "OFFLINE";
  if (stream.status === "LIVE" && Date.now() - stream.updatedAt.getTime() > HEARTBEAT_TIMEOUT_MS) {
    await endStream(eventId);
    return "ENDED";
  }
  return stream.status;
}

export async function ensureStream(eventId: string) {
  return db.liveStream.upsert({
    where: { eventId },
    update: {},
    create: { eventId, roomName: roomNameFor(eventId), status: "OFFLINE" },
  });
}

export async function startStream(eventId: string) {
  await db.$transaction([
    db.liveStream.upsert({
      where: { eventId },
      update: { status: "LIVE", startedAt: new Date(), endedAt: null },
      create: { eventId, roomName: roomNameFor(eventId), status: "LIVE", startedAt: new Date() },
    }),
    db.event.update({ where: { id: eventId }, data: { status: "LIVE" } }),
  ]);
}

/** Touch updatedAt so the stream is not considered abandoned. */
export async function heartbeat(eventId: string) {
  await db.liveStream.updateMany({ where: { eventId, status: "LIVE" }, data: { status: "LIVE" } });
}

export async function endStream(eventId: string) {
  await db.$transaction([
    db.liveStream.updateMany({ where: { eventId, status: "LIVE" }, data: { status: "ENDED", endedAt: new Date() } }),
    db.event.updateMany({ where: { id: eventId, status: "LIVE" }, data: { status: "ENDED" } }),
  ]);
}
