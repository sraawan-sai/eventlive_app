import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ContactPanel } from "@/components/contact-panel";
import { Tr } from "@/components/tr";
import type { UiKey } from "@/lib/ui-text";
import { TERMS, TERMS_UPDATED } from "@/lib/terms";

export const metadata: Metadata = {
  title: "Terms and Conditions — Eventra",
  description: "The rules for using Eventra: accounts, packages and payment, your content, live streaming and more.",
};

const KEY_POINTS: UiKey[] = ["termsK1", "termsK2", "termsK3", "termsK4", "termsK5", "termsK6"];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="inline-block rounded-full bg-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              <Tr k="termsPill" />
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
              <Tr k="termsTitle" />
            </h1>
            <p className="mt-3 text-sm text-foreground/60">
              <Tr k="termsUpdated" />: {TERMS_UPDATED}
            </p>
          </div>

          <section className="mt-10 rounded-3xl bg-tint p-6 sm:p-8" aria-labelledby="key-points">
            <h2 id="key-points" className="text-lg font-bold">
              <Tr k="termsKeyTitle" />
            </h2>
            <ul className="mt-4 space-y-3">
              {KEY_POINTS.map((k) => (
                <li key={k} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                  <span className="mt-0.5 text-brand" aria-hidden="true">✓</span>
                  <span>
                    <Tr k={k} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-foreground/60">
              <Tr k="termsOfficial" />
            </p>
          </section>

          <article className="mt-10 space-y-8 rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(214,40,75,0.08)] ring-1 ring-black/5 sm:p-10" lang="en">
            {TERMS.map((s, i) => (
              <section key={s.title}>
                <h2 className="text-xl font-bold">
                  {i + 1}. {s.title}
                </h2>
                {s.paras?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-foreground/75">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground/75 marker:text-brand">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <div className="mt-10 flex justify-center">
            <ContactPanel />
          </div>
        </div>
      </main>
    </>
  );
}
