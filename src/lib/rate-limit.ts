import "server-only";
import { db } from "@/lib/db";

const MIN = 60;

/** Where a request came from. On Vercel the platform sets these headers, so a visitor cannot choose them. */
export function clientIp(h: Headers) {
  return (h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim().slice(0, 64);
}

/** True when `key` already has `max` or more attempts in the last `windowSec` seconds. If the table is unreachable, do not lock anyone out. */
export async function tooMany(key: string, max: number, windowSec: number) {
  try {
    const n = await db.authAttempt.count({ where: { key, createdAt: { gte: new Date(Date.now() - windowSec * 1000) } } });
    return n >= max;
  } catch {
    return false;
  }
}

export async function recordAttempt(key: string) {
  try {
    await db.authAttempt.create({ data: { key } });
    // Housekeeping: now and then drop rows older than a day.
    if (Math.random() < 0.02) await db.authAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * MIN * 1000) } } });
  } catch {
    /* a logging failure must never block the request */
  }
}

export const LOGIN_WINDOW_SEC = 15 * MIN;
const EMAIL_MAX = 8; // wrong passwords for one account
const IP_MAX = 30; // wrong passwords from one network (a shared venue Wi-Fi still has room)

/** True when this email or this network has had too many failed sign-ins recently. */
export async function loginBlocked(email: string, ip: string) {
  return (await tooMany(`login:email:${email}`, EMAIL_MAX, LOGIN_WINDOW_SEC)) || (await tooMany(`login:ip:${ip}`, IP_MAX, LOGIN_WINDOW_SEC));
}

export async function recordLoginFailure(email: string, ip: string) {
  await Promise.all([recordAttempt(`login:email:${email}`), recordAttempt(`login:ip:${ip}`)]);
}

/** Sign-ups per network per hour. */
export async function registerBlocked(ip: string) {
  return tooMany(`register:ip:${ip}`, 10, 60 * MIN);
}
export const recordRegister = (ip: string) => recordAttempt(`register:ip:${ip}`);

/** Wrong current-password guesses in the profile page (change password, delete account). */
export async function passwordCheckBlocked(userId: string) {
  return tooMany(`pwcheck:${userId}`, 8, LOGIN_WINDOW_SEC);
}
export const recordPasswordCheckFailure = (userId: string) => recordAttempt(`pwcheck:${userId}`);
