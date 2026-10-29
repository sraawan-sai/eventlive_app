import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CUSTOM_EVENTS, PACKAGES } from "@/lib/packages";
import { SiteHeader } from "@/components/site-header";
import { ContactPanel } from "@/components/contact-panel";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Payment — Eventra", robots: { index: false } };

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STEPS = [
  "Scan the QR code or tap Open WhatsApp. The message about your package is already typed.",
  "Send it to us and we will share the payment details.",
  "Pay by UPI and send us the payment screenshot.",
  "We switch on your package on your Eventra account.",
];

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: planId } = await searchParams;
  const custom = planId === "custom";
  const plan = PACKAGES.find((p) => p.id === planId && p.price > 0);
  if (!custom && !plan) redirect("/pricing");

  const user = (await auth())?.user;
  const gst = plan ? Math.round(plan.price * 0.18) : 0;
  const total = plan ? plan.price + gst : 0;
  const message = plan
    ? `Hi, I want the ${plan.name} package (${inr(total)} with GST) on Eventra.${user?.email ? ` My account email is ${user.email}.` : ""}`
    : `Hi, I want a quote for a large event on Eventra.${user?.email ? ` My account email is ${user.email}.` : ""}`;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-10">
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">{custom ? "Get a quote" : "Payment"}</p>
              <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{custom ? CUSTOM_EVENTS.title : `${plan!.name} package`}</h1>
              <p className="mt-2 text-foreground/65">{custom ? CUSTOM_EVENTS.text : plan!.tagline}</p>
            </div>

            <Card className="p-6">
              {plan ? (
                <>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-foreground/65">{plan.name} ({plan.unit})</dt><dd>{inr(plan.price)}</dd></div>
                    <div className="flex justify-between"><dt className="text-foreground/65">GST 18%</dt><dd>{inr(gst)}</dd></div>
                    <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold"><dt>Total</dt><dd>{inr(total)}</dd></div>
                  </dl>
                  <ul className="mt-5 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden>✓</span>{f}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <ul className="space-y-2 text-sm">
                  {CUSTOM_EVENTS.points.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden>✓</span>{f}</li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold">How to pay</h2>
              <ol className="mt-3 space-y-3 text-sm">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-tint text-xs font-bold text-brand">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              {user ? (
                <p className="mt-4 rounded-lg bg-tint px-3 py-2 text-sm">
                  We will add the package to <b>{user.email}</b>. Message us from that account&apos;s details so we can find it.
                </p>
              ) : (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  You are not signed in. <b>Create an account first</b> so we can add the package to it.
                  <ButtonLink href="/register" variant="secondary" className="ml-3 px-4 py-1.5 text-xs">Create account</ButtonLink>
                </p>
              )}
            </Card>
          </div>

          <ContactPanel
            message={message}
            title="Pay and ask on WhatsApp"
            subtitle="Scan to message us about your package. Instagram is for any other question."
          />
        </div>
      </main>
    </>
  );
}
