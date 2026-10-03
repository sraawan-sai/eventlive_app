"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { SPONSOR_RULE } from "@/lib/media";
import { requireUser } from "@/lib/session";
import { deleteObjects, objectSize, publicUrlFor } from "@/lib/storage";

const schema = z.object({
  eventId: z.string().min(1),
  name: z.string().trim().min(1, "Enter the sponsor name").max(100),
  tier: z.string().trim().max(60).optional(),
  websiteUrl: z
    .string()
    .trim()
    .url("Enter a valid link starting with https://")
    .refine((u) => /^https?:\/\//i.test(u), "Link must start with http(s)://")
    .optional()
    .or(z.literal("")),
  display: z.enum(["logo", "photo"]).default("logo"),
  logoKey: z.string().max(300).optional(),
  logoType: z.string().max(100).optional(),
});

export type SponsorItem = {
  id: string;
  name: string;
  tier: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  display: "logo" | "photo";
};
export type SponsorResult = { ok: true; sponsor: SponsorItem } | { ok: false; error: string };

async function ownedEvent(eventId: string, userId: string) {
  const e = await db.event.findUnique({ where: { id: eventId }, select: { userId: true, slug: true } });
  return e && e.userId === userId ? e : null;
}

export async function addSponsorAction(input: unknown): Promise<SponsorResult> {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the details." };
  const d = parsed.data;

  const event = await ownedEvent(d.eventId, user.id);
  if (!event) return { ok: false, error: "Event not found." };
  if ((await db.sponsor.count({ where: { eventId: d.eventId } })) >= SPONSOR_RULE.maxCount) {
    return { ok: false, error: `You can add up to ${SPONSOR_RULE.maxCount} sponsors.` };
  }

  if (d.logoKey) {
    // key must be one we issued for this event's sponsors, and the object must exist
    if (!d.logoKey.startsWith(`events/${d.eventId}/sponsor-`) || !SPONSOR_RULE.types.includes(d.logoType ?? "")) {
      return { ok: false, error: "Invalid logo." };
    }
    const size = await objectSize(d.logoKey);
    if (size === null) return { ok: false, error: "Logo upload not found. Please try again." };
    if (size > SPONSOR_RULE.maxBytes) {
      await deleteObjects([d.logoKey]);
      return { ok: false, error: "Logo is too large." };
    }
  }

  const s = await db.sponsor.create({
    data: {
      eventId: d.eventId,
      name: d.name,
      tier: d.tier || null,
      websiteUrl: d.websiteUrl || null,
      logoKey: d.logoKey ?? null,
      display: d.display,
    },
  });
  revalidatePath(`/event/${event.slug}`);
  return {
    ok: true,
    sponsor: { id: s.id, name: s.name, tier: s.tier, websiteUrl: s.websiteUrl, logoUrl: s.logoKey ? publicUrlFor(s.logoKey) : null, display: s.display === "photo" ? "photo" : "logo" },
  };
}

export async function deleteSponsorAction(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const s = await db.sponsor.findUnique({ where: { id }, include: { event: { select: { userId: true, slug: true } } } });
  if (!s || s.event.userId !== user.id) return { ok: false };
  await db.sponsor.delete({ where: { id } });
  if (s.logoKey) await deleteObjects([s.logoKey]);
  revalidatePath(`/event/${s.event.slug}`);
  return { ok: true };
}
