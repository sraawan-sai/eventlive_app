import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { Button, ButtonLink } from "@/components/ui";
import { Logo } from "@/components/logo";
import { isAdminEmail } from "@/lib/session";

export async function SiteHeader({ marketing = false }: { marketing?: boolean }) {
  const session = await auth();
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        {marketing && (
          <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/70 md:flex">
            <Link href="/" className="text-brand">Home</Link>
            <Link href="/#features" className="hover:text-brand">Features</Link>
            <Link href="/#templates" className="hover:text-brand">Templates</Link>
          </nav>
        )}
        <nav className="flex items-center gap-2">
          {session?.user ? (
            <>
              {isAdminEmail(session.user.email) && <ButtonLink href="/admin" variant="ghost">Admin</ButtonLink>}
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
          )}
        </nav>
      </div>
    </header>
  );
}
