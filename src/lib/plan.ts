import "server-only";
import { db } from "@/lib/db";
import { limitsFor, type PlanLimits, type UsageInfo } from "@/lib/plan-limits";
import { isAdminEmail } from "@/lib/session";

export interface PlanState {
  limits: PlanLimits;
  /** The site owner (ADMIN_EMAILS, Google-created account) is never limited, so demos and tests always work. */
  exempt: boolean;
  usedSeconds: number;
  limitSeconds: number;
  exceeded: boolean;
}

export function isExemptUser(user: { email: string; passwordHash: string | null }) {
  return isAdminEmail(user.email) && user.passwordHash === null;
}

/** Package limits plus how much live time this event has already used (including a stream running right now). */
export async function planState(eventId: string): Promise<PlanState> {
  const e = await db.event.findUnique({
    where: { id: eventId },
    select: { user: { select: { packageId: true, email: true, passwordHash: true } }, stream: true },
  });
  const limits = limitsFor(e?.user.packageId);
  const exempt = e ? isExemptUser(e.user) : false;
  const s = e?.stream;
  const running = s?.status === "LIVE" && s.startedAt ? Math.max(0, Math.floor((Date.now() - s.startedAt.getTime()) / 1000)) : 0;
  const usedSeconds = (s?.liveSeconds ?? 0) + running;
  const limitSeconds = limits.maxLiveMinutes * 60;
  return { limits, exempt, usedSeconds, limitSeconds, exceeded: !exempt && usedSeconds >= limitSeconds };
}

export const toUsage = (p: PlanState): UsageInfo => ({
  planName: p.limits.name,
  maxViewers: p.limits.maxViewers,
  limitSeconds: p.limitSeconds,
  usedSeconds: p.usedSeconds,
  exempt: p.exempt,
});

export async function userStorageBytes(userId: string) {
  const r = await db.eventMedia.aggregate({ where: { event: { userId } }, _sum: { sizeBytes: true } });
  return r._sum.sizeBytes ?? 0;
}
