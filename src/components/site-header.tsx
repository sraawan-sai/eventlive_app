import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { Button, ButtonLink } from "@/components/ui";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { isAdminUser } from "@/lib/session";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
];

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const admin = isAdminUser(user);
  const links = user
    ? [...MAIN_LINKS, { href: "/dashboard", label: "Dashboard" }, { href: "/create-event", label: "Create event" }, ...(admin ? [{ href: "/admin", label: "Admin" }] : [])]
    : MAIN_LINKS;

  const account = user ? (
    <>
      {admin && <ButtonLink href="/admin" variant="ghost">Admin</ButtonLink>}
      <ButtonLink href="/dashboard" variant="ghost">Dashboard</ButtonLink>
      <form action={logoutAction}>
        <Button variant="secondary" type="submit">Log out</Button>
      </form>
    </>
  ) : (
    <>
      <ButtonLink href="/login" variant="secondary">Sign in</ButtonLink>
      <ButtonLink href="/register">Get Started</ButtonLink>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/70 md:flex">
          {MAIN_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">{account}</div>
        <MobileMenu links={links}>{account}</MobileMenu>
      </div>
    </header>
  );
}
