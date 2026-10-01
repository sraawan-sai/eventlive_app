import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

const RESERVED = new Set(["live", "new", "edit", "api", "admin"]);

/** Returns `base`, or `base-2`, `base-3`… whichever is free. */
export async function uniqueSlug(input: string, excludeEventId?: string): Promise<string> {
  let base = slugify(input) || "event";
  if (RESERVED.has(base)) base = `${base}-event`;
  let candidate = base;
  for (let n = 2; ; n++) {
    const clash = await db.event.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!clash || clash.id === excludeEventId) return candidate;
    candidate = `${base}-${n}`;
  }
}
