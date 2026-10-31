import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { Button, ButtonLink } from "@/components/ui";
import { Logo } from "@/components/logo";
import { MobileMenu, type MenuLink } from "@/components/mobile-menu";
import { AccountMenu } from "@/components/account-menu";
import { Tr } from "@/components/tr";
import { LangSelect } from "@/components/event/lang";
import { isAdminUser } from "@/lib/session";

/** The few links shown across the top. Home is the logo; the phone menu lists every page. */
const MAIN_LINKS: MenuLink[] = [
  { href: "/#templates", key: "navTemplates" },
  { href: "/demo", key: "navDemo" },
  { href: "/pricing", key: "navPricing" },
];

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const admin = isAdminUser(user);

  const accountLinks: MenuLink[] = user
    ? [
        { href: "/dashboard", key: "dashboard" },
        { href: "/create-event", key: "createEvent" },
        { href: "/media", key: "mediaLibrary" },
        { href: "/profile", key: "profile" },
        ...(admin ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [];
  const phoneLinks: MenuLink[] = [{ href: "/", key: "navHome" }, { href: "/#features", key: "navFeatures" }, ...MAIN_LINKS, ...accountLinks];

  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Logo className="justify-self-start" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/70 lg:flex">
          {MAIN_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">
              {l.key ? <Tr k={l.key} /> : l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center justify-end gap-3 lg:flex">
          <LangSelect />
          {user ? (
            <AccountMenu initial={initial} links={accountLinks} />
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary"><Tr k="signIn" /></ButtonLink>
              <ButtonLink href="/register"><Tr k="getStarted" /></ButtonLink>
            </>
          )}
        </div>
        <MobileMenu links={phoneLinks}>
          <LangSelect className="w-full py-2.5" />
          {user ? (
            <form action={logoutAction}>
              <Button variant="secondary" type="submit"><Tr k="logOut" /></Button>
            </form>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary"><Tr k="signIn" /></ButtonLink>
              <ButtonLink href="/register"><Tr k="getStarted" /></ButtonLink>
            </>
          )}
        </MobileMenu>
      </div>
    </header>
  );
}
