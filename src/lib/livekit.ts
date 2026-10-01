import "server-only";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

const BROADCASTER_PREFIX = "broadcaster-";
const GUEST_PREFIX = "guest-";

export function livekitConfig() {
  const url = process.env.LIVEKIT_URL;
  const key = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!url || !key || !secret) return null;
  return { url, key, secret };
}

export const roomNameFor = (eventId: string) => `event_${eventId}`;

/** A LiveKit LIVE stream with no heartbeat for this long is treated as ended (broadcaster closed the tab). */
export const HEARTBEAT_TIMEOUT_MS = 90_000; // tolerates several missed 10s heartbeats on a slow link

interface TokenOpts {
  room: string;
  role: "broadcaster" | "viewer";
  /** user id for broadcaster; ignored for viewers */
  userId?: string;
  name?: string;
}

/**
 * Permissions are derived ONLY from `role`, which callers must have verified server-side.
 * Viewers can never publish.
 */
export async function createLiveKitToken({ room, role, userId, name }: TokenOpts) {
  const cfg = livekitConfig();
  if (!cfg) throw new Error("LiveKit is not configured");
  const isBroadcaster = role === "broadcaster";
  const identity = isBroadcaster ? `${BROADCASTER_PREFIX}${userId}` : `${GUEST_PREFIX}${crypto.randomUUID()}`;

  const at = new AccessToken(cfg.key, cfg.secret, {
    identity,
    name: isBroadcaster ? name ?? "Broadcaster" : "Guest",
    ttl: isBroadcaster ? "8h" : "3h",
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: isBroadcaster,
    canPublishData: isBroadcaster,
    canSubscribe: true,
  });
  return { token: await at.toJwt(), url: cfg.url, identity };
}

function roomService() {
  const cfg = livekitConfig();
  if (!cfg) return null;
  return new RoomServiceClient(cfg.url.replace(/^wss:/, "https:").replace(/^ws:/, "http:"), cfg.key, cfg.secret);
}

/** Number of guests currently connected. Returns 0 if the room does not exist yet. */
export async function countViewers(room: string): Promise<number> {
  const svc = roomService();
  if (!svc) return 0;
  try {
    const people = await svc.listParticipants(room);
    return people.filter((p) => p.identity.startsWith(GUEST_PREFIX)).length;
  } catch {
    return 0;
  }
}

/** Disconnects everyone (used when the owner stops the stream). Best effort. */
export async function closeRoom(room: string) {
  try {
    await roomService()?.deleteRoom(room);
  } catch {
    /* room may already be gone */
  }
}
