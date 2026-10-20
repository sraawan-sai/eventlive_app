import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { ADDONS, CUSTOM_EVENTS, PACKAGES } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Pricing — Eventra",
  description: "Simple packages for event websites and live streaming: Free, Basic, Pro and Premium.",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function contactHref(plan: string) {
  const wa = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.replace(/\D/g, "");
  return wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`Hi, I want the ${plan} package on Eventra.`)}` : "/register";
}

export default function PricingPage() {
  return (
    <>
      <SiteHeader marketing />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-white via-tint to-rose-100/60 px-4 py-14 text-center sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Pricing</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-serif text-4xl font-bold sm:text-5xl">Pick the package that fits your event</h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            Pay once per event. Prices are before 18% GST.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((p) => (
              <li
                key={p.id}
                className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(20,20,40,0.06)] ${p.popular ? "ring-2 ring-brand" : "ring-1 ring-black/10"}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Most popular</span>
                )}
                <h2 className="font-serif text-2xl font-bold">{p.name}</h2>
                <p className="mt-1 min-h-10 text-sm text-foreground/60">{p.tagline}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{p.price === 0 ? "Free" : inr(p.price)}</span>
                  <span className="ml-1 text-sm text-foreground/60">{p.unit}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-0.5 text-brand" aria-hidden>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={p.price === 0 ? "/register" : contactHref(p.name)} variant={p.popular ? "primary" : "secondary"} className="mt-6 w-full">
                  {p.price === 0 ? "Start free" : "Choose " + p.name}
                </ButtonLink>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-foreground/60">
            Online payment is coming soon. For now, choose a package and we&apos;ll set it up for you.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-black/10 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold">{CUSTOM_EVENTS.title}</h2>
              <p className="mt-2 text-sm text-foreground/70">{CUSTOM_EVENTS.text}</p>
              <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
                {CUSTOM_EVENTS.points.map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-brand" aria-hidden>✓</span>{t}</li>
                ))}
              </ul>
            </div>
            <ButtonLink href={contactHref("Custom")} className="mt-5 w-full sm:mt-0 sm:w-auto sm:shrink-0">Get a quote</ButtonLink>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16">
          <h2 className="text-center font-serif text-2xl font-bold">Add-ons</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {ADDONS.map((a) => (
              <li key={a.name} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10">
                <span>{a.name}</span>
                <span className="font-semibold">{inr(a.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-foreground/50">
            Viewers means people watching at the same time.
          </p>
        </section>
      </main>
      <footer className="border-t border-black/5 py-6 text-center text-sm text-foreground/50">© Eventra</footer>
    </>
  );
}
