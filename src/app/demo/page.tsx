import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { EventWizard } from "@/components/event/wizard";

export const metadata: Metadata = {
  title: "Try the demo — Eventra",
  description: "Build a sample event website in a minute, no sign-up needed.",
};

// Open to everyone: the wizard runs in demo mode and never saves anything.
export default function DemoPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-8">
        <EventWizard demo />
      </main>
    </>
  );
}
