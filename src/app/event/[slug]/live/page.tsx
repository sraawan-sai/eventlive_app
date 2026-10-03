import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { livekitConfig } from "@/lib/livekit";
import { ButtonLink, Card } from "@/components/ui";
import { SiteHeader } from "@/components/site-header";
import { Broadcaster } from "@/components/live/broadcaster";

export const metadata = { title: "Broadcast — Eventra" };

type Props = PageProps<"/event/[slug]/live">;

// Owner-only. The token API re-checks ownership; this page check is for UX.
export default async function BroadcasterPage({ params }: Props) {
  const { slug } = await params;
  const user = await requireUser();
  const event = await db.event.findUnique({ where: { slug }, select: { name: true, userId: true } });
  if (!event || event.userId !== user.id) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 py-6">
        {livekitConfig() ? (
          <Broadcaster slug={slug} eventName={event.name} />
        ) : (
          <Card className="mx-auto max-w-xl text-center">
            <h1 className="font-serif text-2xl font-bold">Live streaming isn&apos;t configured</h1>
            <p className="mt-2 text-foreground/70">
              Add <code>LIVEKIT_URL</code>, <code>LIVEKIT_API_KEY</code> and <code>LIVEKIT_API_SECRET</code> to <code>.env.local</code> and restart the server.
            </p>
            <ButtonLink href="/dashboard" className="mt-4">Back to dashboard</ButtonLink>
          </Card>
        )}
      </main>
    </>
  );
}
