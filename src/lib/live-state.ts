import "server-only";
import { db } from "@/lib/db";
import { HEARTBEAT_TIMEOUT_MS, closeRoom, roomNameFor } from "@/lib/livekit";
import { planState } from "@/lib/plan";

/**
 * Current stream status for an event. If the stream says LIVE but the broadcaster
 * stopped sending heartbeats, it is marked ENDED so guests are not left on a dead stream.
 */
export async function getStreamStatus(eventId: string): Promise<"OFFLINE" | "LIVE" | "ENDED"> {
  const stream = await db.liveStream.findUnique({ where: { eventId } });
  if (!stream) return "OFFLINE";
  if (stream.status === "LIVE" && Date.now() - stream.updatedAt.getTime() > HEARTBEAT_TIMEOUT_MS) {
    await endStream(eventId, stream.updatedAt); // count live time only up to the last heartbeat
    return "ENDED";
  }
  // Server-side limit: any poll by a guest or the owner ends a stream that has used up its package time,
  // so a modified browser cannot keep streaming past the limit.
  if (stream.status === "LIVE" && (await planState(eventId)).exceeded) {
    await stopForLimit(eventId);
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

/** Ends a stream, adds the time it was live to the event's total, and disconnects everyone. */
export async function endStream(eventId: string, at: Date = new Date()) {
  const s = await db.liveStream.findUnique({ where: { eventId } });
  const add = s?.status === "LIVE" && s.startedAt ? Math.max(0, Math.floor((at.getTime() - s.startedAt.getTime()) / 1000)) : 0;
  await db.$transaction([
    db.liveStream.updateMany({
      where: { eventId, status: "LIVE" },
      data: { status: "ENDED", endedAt: at, liveSeconds: { increment: add } },
    }),
    db.event.updateMany({ where: { id: eventId, status: "LIVE" }, data: { status: "ENDED" } }),
  ]);
}

export async function stopForLimit(eventId: string) {
  await endStream(eventId);
  await closeRoom(roomNameFor(eventId));
}
