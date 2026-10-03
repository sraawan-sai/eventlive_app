"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { uniqueSlug } from "@/lib/slug";
import { eventSchema, scheduleSchema } from "@/lib/validators";
import { deleteObjects } from "@/lib/storage";

export type EventResult =
  | { ok: true; slug: string; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

function toData(d: ReturnType<typeof eventSchema.parse>) {
  return {
    name: d.name,
    type: d.type,
    hostOne: d.hostOne ?? null,
    hostTwo: d.hostTwo ?? null,
    description: d.description ?? null,
    eventDate: new Date(`${d.eventDate}T00:00:00Z`),
    startTime: d.startTime ?? null,
    endTime: d.endTime ?? null,
    venueName: d.venueName ?? null,
    venueAddress: d.venueAddress ?? null,
    coverImageUrl: d.coverImageUrl ?? null,
    template: d.template,
  };
}

export async function createEventAction(input: unknown): Promise<EventResult> {
  const user = await requireUser();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const slug = await uniqueSlug(parsed.data.slug || parsed.data.name);
  const event = await db.event.create({
    data: { ...toData(parsed.data), slug, userId: user.id, status: "PUBLISHED" },
    select: { id: true, slug: true },
  });
  revalidatePath("/dashboard");
  return { ok: true, ...event };
}

export async function updateEventAction(
  id: string,
  input: unknown,
  scheduleInput: unknown,
  status: "DRAFT" | "PUBLISHED",
): Promise<EventResult> {
  const user = await requireUser();
  const existing = await db.event.findUnique({ where: { id }, select: { userId: true, status: true } });
  if (!existing || existing.userId !== user.id) return { ok: false, error: "Event not found." };

  const parsed = eventSchema.safeParse(input);
  const schedule = scheduleSchema.safeParse(scheduleInput);
  if (!parsed.success || !schedule.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
    };
  }

  const wanted = parsed.data.slug;
  const slug = wanted ? await uniqueSlug(wanted, id) : undefined;
  if (wanted && slug !== wanted) {
    return { ok: false, error: "That link is already taken.", fieldErrors: { slug: ["Already taken"] } };
  }

  // Never downgrade an event that is LIVE/ENDED via the edit form.
  const nextStatus = existing.status === "LIVE" || existing.status === "ENDED" ? existing.status : status;

  const event = await db.$transaction(async (tx) => {
    await tx.eventSchedule.deleteMany({ where: { eventId: id } });
    return tx.event.update({
      where: { id },
      data: {
        ...toData(parsed.data),
        ...(slug ? { slug } : {}),
        status: nextStatus,
        schedule: {
          create: schedule.data.map((s) => ({
            title: s.title,
            description: s.description ?? null,
            startTime: s.startTime,
            endTime: s.endTime ?? null,
          })),
        },
      },
      select: { id: true, slug: true },
    });
  });
  revalidatePath("/dashboard");
  revalidatePath(`/event/${event.slug}`);
  return { ok: true, ...event };
}

export async function deleteEventAction(id: string) {
  const user = await requireUser();
  const files = await db.eventMedia.findMany({ where: { eventId: id, event: { userId: user.id } }, select: { key: true } });
  // deleteMany scoped by userId = ownership check in a single query
  const logos = await db.sponsor.findMany({ where: { eventId: id, logoKey: { not: null }, event: { userId: user.id } }, select: { logoKey: true } });
  await db.event.deleteMany({ where: { id, userId: user.id } });
  await deleteObjects([...files.map((f) => f.key), ...logos.map((l) => l.logoKey!)]);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
