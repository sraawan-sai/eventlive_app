import "server-only";
import { NextResponse } from "next/server";

/**
 * Defence against other websites making a visitor's browser call our API (cross-site request forgery).
 * Browsers say where a request came from; anything from another site is refused. Requests with neither header
 * (scripts such as curl) are allowed, because they cannot ride on a visitor's cookies anyway.
 */
export function crossSiteBlocked(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site !== "same-origin" && site !== "none";
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
}

export const forbidden = () => NextResponse.json({ error: "Forbidden." }, { status: 403 });

// Simple per-server counters for the public live endpoints. Limits are generous because a whole wedding hall
// can share one Wi-Fi address; this only stops runaway scripts.
const hits = new Map<string, { n: number; reset: number }>();

/** True when `key` has been used more than `max` times in the current `windowMs`. */
export function floodLimited(key: string, max: number, windowMs = 60_000) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    hits.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  h.n += 1;
  return h.n > max;
}
