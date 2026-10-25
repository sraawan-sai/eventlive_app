"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

/** Hamburger menu for phones. Links close the menu; `children` is the server-rendered account area. */
export function MobileMenu({ links, children }: { links: { href: string; label: string }[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-foreground/80 hover:bg-black/5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-black/5 bg-white px-4 pb-4 shadow-lg">
          <nav className="flex flex-col py-2 text-base font-medium">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-black/5">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t border-black/5 pt-3 [&>*]:w-full [&_a]:w-full [&_button]:w-full">{children}</div>
        </div>
      )}
    </div>
  );
}
