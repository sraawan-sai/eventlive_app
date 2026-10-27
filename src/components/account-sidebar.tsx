import Link from "next/link";
import { CalendarIcon, CogIcon, GridIcon, PlusIcon, TagIcon } from "@/components/icons";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: GridIcon },
  { href: "/dashboard#events", label: "My Events", Icon: CalendarIcon },
  { href: "/create-event", label: "Create Event", Icon: PlusIcon },
  { href: "/pricing", label: "Packages", Icon: TagIcon },
  { href: "/profile", label: "Profile & Settings", Icon: CogIcon },
];

/** Left menu for signed-in account pages. Shown on large screens; phones use the header menu. */
export function AccountSidebar({ active }: { active: string }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white px-3 py-6 lg:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {ITEMS.map(({ href, label, Icon }) => {
          const on = href === active;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${on ? "bg-tint text-brand" : "text-foreground/70 hover:bg-black/5"}`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
