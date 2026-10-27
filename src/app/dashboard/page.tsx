import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { eventTypeLabel } from "@/lib/event-types";
import { formatDate } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { isExemptUser, userStorageBytes } from "@/lib/plan";
import { limitsFor } from "@/lib/plan-limits";
import { fmtBytes } from "@/lib/admin-data";
import { DashboardEvents, type DashboardEvent } from "@/components/dashboard-events";

export const metadata = { title: "Dashboard — Eventra" };

export default async function DashboardPage() {
  const user = await requireUser();
  const rows = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { eventDate: "desc" },
    include: { stream: { select: { status: true } } },
  });

  const owner = await db.user.findUnique({ where: { id: user.id }, select: { name: true, packageId: true, email: true, passwordHash: true } });
  const limits = limitsFor(owner?.packageId);
  const exempt = owner ? isExemptUser(owner) : false;
  const usedBytes = await userStorageBytes(user.id);

  const events: DashboardEvent[] = rows.map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    type: e.type,
    typeLabel: eventTypeLabel(e.type),
    dateLabel: formatDate(e.eventDate),
    venue: e.venueName,
    status: e.stream?.status === "LIVE" ? "LIVE" : e.status,
    template: e.template,
    coverImageUrl: e.coverImageUrl,
  }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Welcome, {(owner?.name ?? user.name)?.split(" ")[0] ?? "there"}</h1>
            <p className="text-foreground/60">Manage your events and go live</p>
          </div>
          <ButtonLink href="/create-event">+ Create Event</ButtonLink>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tint px-4 py-3 text-sm">
          {exempt ? (
            <span><b>Owner access:</b> no package limits.</span>
          ) : (
            <span>
              <b>{limits.name} package:</b> up to {limits.maxViewers} viewers · {limits.maxLiveMinutes} min live per event · files {fmtBytes(usedBytes)} of {limits.storageGB} GB
            </span>
          )}
          {!exempt && <ButtonLink href="/pricing" variant="secondary" className="px-4 py-1.5 text-xs">Upgrade</ButtonLink>}
        </div>
        <section id="events" className="scroll-mt-24"><DashboardEvents events={events} /></section>
      </main>
    </>
  );
}
