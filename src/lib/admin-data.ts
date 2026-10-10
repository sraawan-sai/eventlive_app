import "server-only";
import { db } from "@/lib/db";

export const fmtBytes = (n: number) => {
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
};

export async function getOverview() {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [users, events, live, logins7d, storage] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.liveStream.count({ where: { status: "LIVE" } }),
    db.loginEvent.count({ where: { createdAt: { gte: since } } }),
    db.eventMedia.aggregate({ _sum: { sizeBytes: true } }),
  ]);
  return { users, events, live, logins7d, storageBytes: storage._sum.sizeBytes ?? 0 };
}

/** Users with event counts, storage used and last login. One query per aggregate, not per user. */
export async function listUsers(q: string) {
  const users = await db.user.findMany({
    where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] } : undefined,
    orderBy: [{ lastLoginAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    take: 200,
    select: {
      id: true, name: true, email: true, passwordHash: true, createdAt: true, lastLoginAt: true, loginCount: true,
      _count: { select: { events: true } },
    },
  });
  const ids = users.map((u) => u.id);
  const media = ids.length
    ? await db.eventMedia.findMany({ where: { event: { userId: { in: ids } } }, select: { sizeBytes: true, event: { select: { userId: true } } } })
    : [];
  const bytes = new Map<string, number>();
  for (const m of media) bytes.set(m.event.userId, (bytes.get(m.event.userId) ?? 0) + m.sizeBytes);
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    hasPassword: !!u.passwordHash,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    loginCount: u.loginCount,
    events: u._count.events,
    storageBytes: bytes.get(u.id) ?? 0,
  }));
}

export async function getUserDetail(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "desc" }, include: { stream: { select: { status: true } }, media: { select: { sizeBytes: true } } } },
      logins: { orderBy: { createdAt: "desc" }, take: 30 },
    },
  });
  return user;
}

export async function recentLogins() {
  return db.loginEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
