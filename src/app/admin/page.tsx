import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { fmtBytes, getOverview, listUsers, recentLogins } from "@/lib/admin-data";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui";

export const metadata = { title: "Admin — Eventra", robots: { index: false } };

const when = (d: Date | null) =>
  d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "Never";

function device(ua: string | null) {
  if (!ua) return "Unknown";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Other";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Browser";
  return `${br} on ${os}`;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q = "" } = await searchParams;
  const [o, users, logins] = await Promise.all([getOverview(), listUsers(q.trim().slice(0, 80)), recentLogins()]);

  const stats = [
    ["Users", o.users],
    ["Events", o.events],
    ["Live now", o.live],
    ["Logins (7 days)", o.logins7d],
    ["Files stored", fmtBytes(o.storageBytes)],
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="font-serif text-3xl font-bold">Admin</h1>
        <p className="text-foreground/60">Users and activity across Eventra.</p>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stats.map(([label, v]) => (
            <li key={label}>
              <Card className="p-4">
                <p className="text-xs text-foreground/60">{label}</p>
                <p className="mt-1 text-2xl font-bold">{v}</p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold">Users</h2>
          <form className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Search name or email" aria-label="Search users" className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm sm:w-64" />
            <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Search</button>
          </form>
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Sign-in</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Logins</th>
                <th className="px-4 py-3 text-right">Events</th>
                <th className="px-4 py-3 text-right">Storage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold text-brand hover:underline">{u.name}</Link>
                    <div className="text-xs text-foreground/60">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">{u.hasPassword ? "Email + password" : "Google"}</td>
                  <td className="px-4 py-3">{when(u.createdAt)}</td>
                  <td className="px-4 py-3">{when(u.lastLoginAt)}</td>
                  <td className="px-4 py-3 text-right">{u.loginCount}</td>
                  <td className="px-4 py-3 text-right">{u.events}</td>
                  <td className="px-4 py-3 text-right">{fmtBytes(u.storageBytes)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-foreground/60">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 mt-10 text-lg font-semibold">Recent logins</h2>
        <ul className="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
          {logins.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>
                <Link href={`/admin/users/${l.user.id}`} className="font-semibold text-brand hover:underline">{l.user.name}</Link>{" "}
                <span className="text-foreground/60">{l.user.email}</span>
              </span>
              <span className="text-foreground/60">
                {l.method === "google" ? "Google" : "Password"} · {device(l.userAgent)} · {when(l.createdAt)}
              </span>
            </li>
          ))}
          {logins.length === 0 && <li className="px-4 py-6 text-center text-foreground/60">No logins recorded yet. They appear from the next sign-in.</li>}
        </ul>
      </main>
    </>
  );
}
