import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { publicUrlFor } from "@/lib/storage";
import { fmtBytes } from "@/lib/admin-data";
import { isExemptUser, userStorageBytes } from "@/lib/plan";
import { limitsFor } from "@/lib/plan-limits";
import { SiteHeader } from "@/components/site-header";
import { AccountSidebar } from "@/components/account-sidebar";
import { MusicIcon, VideoIcon } from "@/components/icons";
import { Card } from "@/components/ui";

export const metadata = { title: "Media Library — Eventra", robots: { index: false } };

const KIND_LABEL = { PHOTO: "Photos", CARD: "Invitation card", VIDEO: "Videos", MUSIC: "Music" } as const;

export default async function MediaLibraryPage() {
  const user = await requireUser();
  const [events, owner, used] = await Promise.all([
    db.event.findMany({
      where: { userId: user.id, media: { some: {} } },
      orderBy: { eventDate: "desc" },
      select: { id: true, name: true, media: { orderBy: { createdAt: "asc" }, select: { id: true, kind: true, key: true, sizeBytes: true } } },
    }),
    db.user.findUnique({ where: { id: user.id }, select: { packageId: true, email: true, passwordHash: true } }),
    userStorageBytes(user.id),
  ]);
  const limits = limitsFor(owner?.packageId);
  const exempt = owner ? isExemptUser(owner) : false;
  const limitBytes = limits.storageGB * 1024 ** 3;
  const pct = Math.min(100, Math.round((used / limitBytes) * 100));

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 bg-slate-50">
        <AccountSidebar active="/media" />
        <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8 lg:mx-0 lg:px-10">
          <div>
            <h1 className="font-serif text-3xl font-bold">Media Library</h1>
            <p className="text-foreground/60">Every photo, card, video and song you have uploaded</p>
          </div>

          <Card className="p-5">
            <p className="text-sm">
              <b>{fmtBytes(used)}</b> used{exempt ? "" : <> of {limits.storageGB} GB ({limits.name} package)</>}
            </p>
            {!exempt && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Storage used">
                <div className={`h-full ${pct >= 90 ? "bg-red-500" : "bg-brand"}`} style={{ width: `${pct}%` }} />
              </div>
            )}
          </Card>

          {events.length === 0 && (
            <Card className="py-10 text-center text-foreground/60">
              No files yet. Upload photos, a card or videos from an event&apos;s edit page.
            </Card>
          )}

          {events.map((e) => (
            <Card key={e.id} className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">{e.name}</h2>
                <Link href={`/dashboard/events/${e.id}`} className="text-sm font-medium text-brand hover:underline">Manage files</Link>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {e.media.map((m) => {
                  const url = publicUrlFor(m.key);
                  return (
                    <li key={m.id} className="overflow-hidden rounded-xl ring-1 ring-black/10">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="flex aspect-square items-center justify-center bg-black/[0.04] text-foreground/50">
                          {m.kind === "PHOTO" || m.kind === "CARD" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : m.kind === "VIDEO" ? (
                            <VideoIcon width={32} height={32} />
                          ) : (
                            <MusicIcon width={32} height={32} />
                          )}
                        </div>
                        <p className="flex justify-between gap-2 px-2.5 py-2 text-xs">
                          <span className="truncate">{KIND_LABEL[m.kind]}</span>
                          <span className="shrink-0 text-foreground/60">{fmtBytes(m.sizeBytes)}</span>
                        </p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </main>
      </div>
    </>
  );
}
