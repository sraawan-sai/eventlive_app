import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { fmtBytes, getUserDetail } from "@/lib/admin-data";
import { eventTypeLabel } from "@/lib/event-types";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui";

export const metadata = { title: "User — Admin", robots: { index: false } };

const when = (d: Date | null) =>
  d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "Never";

export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const u = await getUserDetail(id);
  if (!u) notFound();
  const storage = u.events.reduce((n, e) => n + e.media.reduce((m, f) => m + f.sizeBytes, 0), 0);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Link href="/admin" className="text-sm text-brand hover:underline">← All users</Link>
        <h1 className="mt-2 font-serif text-3xl font-bold">{u.name}</h1>
        <p className="text-foreground/60">{u.email} · {u.passwordHash ? "Email + password" : "Google"}</p>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([["Joined", when(u.createdAt)], ["Last login", when(u.lastLoginAt)], ["Logins", u.loginCount], ["Storage", fmtBytes(storage)]] as const).map(([k, v]) => (
            <li key={k}><Card className="p-4"><p className="text-xs text-foreground/60">{k}</p><p className="mt-1 font-semibold">{v}</p></Card></li>
          ))}
        </ul>

        <h2 className="mb-3 mt-8 text-lg font-semibold">Events ({u.events.length})</h2>
        <ul className="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
          {u.events.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>
                <Link href={`/event/${e.slug}`} className="font-semibold text-brand hover:underline">{e.name}</Link>{" "}
                <span className="text-foreground/60">{eventTypeLabel(e.type)}</span>
              </span>
              <span className="flex items-center gap-3 text-foreground/60">
                {fmtBytes(e.media.reduce((m, f) => m + f.sizeBytes, 0))}
                <StatusBadge status={e.stream?.status === "LIVE" ? "LIVE" : e.status} />
              </span>
            </li>
          ))}
          {u.events.length === 0 && <li className="px-4 py-6 text-center text-foreground/60">No events.</li>}
        </ul>

        <h2 className="mb-3 mt-8 text-lg font-semibold">Login history</h2>
        <ul className="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
          {u.logins.map((l) => (
            <li key={l.id} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
              <span>{l.method === "google" ? "Google" : "Password"}</span>
              <span className="truncate text-foreground/60">{l.userAgent ?? "Unknown device"}</span>
              <span className="text-foreground/60">{when(l.createdAt)}</span>
            </li>
          ))}
          {u.logins.length === 0 && <li className="px-4 py-6 text-center text-foreground/60">No logins recorded yet.</li>}
        </ul>
      </main>
    </>
  );
}
