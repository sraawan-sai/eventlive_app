import "server-only";
import { db } from "@/lib/db";
import { closeRoom, roomNameFor } from "@/lib/livekit";
import { deleteObjects } from "@/lib/storage";

/** Permanently removes a user, their events and every uploaded file. Shared by self-delete and admin-delete. */
export async function deleteUserAccount(userId: string) {
  const [media, logos, live] = await Promise.all([
    db.eventMedia.findMany({ where: { event: { userId } }, select: { key: true } }),
    db.sponsor.findMany({ where: { logoKey: { not: null }, event: { userId } }, select: { logoKey: true } }),
    db.event.findMany({ where: { userId, status: "LIVE" }, select: { id: true } }),
  ]);
  await Promise.all(live.map((e) => closeRoom(roomNameFor(e.id))));
  // Events, schedule, stream, media rows, sponsors and login history are removed by the cascade.
  await db.user.deleteMany({ where: { id: userId } });
  await deleteObjects([...media.map((m) => m.key), ...logos.map((l) => l.logoKey!)]);
}
