import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { FaqList } from "@/components/faq-list";
import { ContactPanel } from "@/components/contact-panel";
import { Tr } from "@/components/tr";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ — Eventra",
  description: "Answers about event websites, live streaming, packages and payments on Eventra.",
};

// Lets search engines show the questions in results. Built from our own fixed text above.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q.en, acceptedAnswer: { "@type": "Answer", text: f.a.en } })),
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="inline-block rounded-full bg-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              <Tr k="faqPill" />
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
              <Tr k="faqTitle" />
            </h1>
            <p className="mt-3 text-lg text-foreground/60">
              <Tr k="faqSub" />
            </p>
          </div>
          <div className="mt-10">
            <FaqList />
          </div>
          <h2 className="mt-14 text-center font-serif text-2xl font-bold">
            <Tr k="stillQ" />
          </h2>
          <div className="mt-6 flex justify-center">
            <ContactPanel />
          </div>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
