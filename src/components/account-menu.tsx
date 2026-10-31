import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { Tr } from "@/components/tr";
import type { MenuLink } from "@/components/mobile-menu";

/** The signed-in person's menu: one round button that opens Dashboard, Profile and the rest, instead of a row of buttons. */
export function AccountMenu({ initial, links }: { initial: string; links: MenuLink[] }) {
  return (
    <details className="group relative">
      <summary
        className="grid size-10 cursor-pointer list-none place-items-center rounded-full bg-tint text-base font-bold text-brand ring-1 ring-brand/20 transition hover:ring-brand/50 [&::-webkit-details-marker]:hidden"
        aria-label="Account"
      >
        {initial}
      </summary>
      <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/10">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5">
            {l.key ? <Tr k={l.key} /> : l.label}
          </Link>
        ))}
        <form action={logoutAction} className="mt-1 border-t border-black/5 pt-1">
          <button type="submit" className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50">
            <Tr k="logOut" />
          </button>
        </form>
      </div>
    </details>
  );
}
