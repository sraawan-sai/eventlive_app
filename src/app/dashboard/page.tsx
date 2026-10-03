import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { eventTypeLabel } from "@/lib/event-types";
import { formatDate } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { DashboardEvents, type DashboardEvent } from "@/components/dashboard-events";

export const metadata = { title: "Dashboard — Eventra" };

export default async function DashboardPage() {
  const user = await requireUser();
  const rows = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { eventDate: "desc" },
    include: { stream: { select: { status: true } } },
  });

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
            <h1 className="font-serif text-3xl font-bold">Welcome, {user.name?.split(" ")[0] ?? "there"}</h1>
            <p className="text-foreground/60">Manage your events and go live</p>
          </div>
          <ButtonLink href="/create-event">+ Create Event</ButtonLink>
        </div>
        <DashboardEvents events={events} />
      </main>
    </>
  );
}
