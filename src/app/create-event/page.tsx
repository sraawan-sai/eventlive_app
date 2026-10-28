import { requireUser } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { EventWizard } from "@/components/event/wizard";
import { EVENT_TYPES } from "@/lib/event-types";

export const metadata = { title: "Create event — Eventra" };

export default async function CreateEventPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireUser();
  const { type } = await searchParams;
  const initialType = EVENT_TYPES.find((t) => t === type);
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-8">
        <EventWizard initialType={initialType} />
      </main>
    </>
  );
}
