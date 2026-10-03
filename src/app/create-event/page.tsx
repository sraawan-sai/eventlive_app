import { requireUser } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { EventWizard } from "@/components/event/wizard";

export const metadata = { title: "Create event — Eventra" };

export default async function CreateEventPage() {
  await requireUser();
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-8">
        <EventWizard />
      </main>
    </>
  );
}
