import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { HomeHero } from "@/components/home-hero";
import { HowItWorks } from "@/components/how-it-works";
import { Lbl, Tr } from "@/components/tr";
import { EVENT_TYPES, EVENT_TYPE_CONFIG } from "@/lib/event-types";
import { CategoryCarousel, type Category } from "@/components/category-carousel";
import { TEMPLATE_LIST } from "@/lib/templates";

const CATEGORY_IMAGE: Record<(typeof EVENT_TYPES)[number], string> = {
  WEDDING: "wedding",
  BIRTHDAY: "birthday",
  ANNIVERSARY: "anniversary",
  RELIGIOUS: "religious",
  CORPORATE: "corporate",
  CONCERT: "concert",
  GRADUATION: "graduation",
  OTHER: "other",
};

const CATEGORIES: Category[] = EVENT_TYPES.map((t) => ({
  type: t,
  label: EVENT_TYPE_CONFIG[t].label,
  emoji: EVENT_TYPE_CONFIG[t].emoji,
  textKey: `cat${t}`,
  image: `/images/categories/${CATEGORY_IMAGE[t]}.jpg`,
}));

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <HowItWorks />

        <section className="relative overflow-hidden bg-gradient-to-b from-white via-tint/60 to-white py-16 sm:py-20">
          <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-rose-200/40 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-purple-200/40 blur-3xl" aria-hidden="true" />
          <div className="relative px-4 text-center">
            <p className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand ring-1 ring-brand/20">
              <Tr k="catPill" />
            </p>
            <h2 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              <Tr k="catTitleA" />{" "}
              <span className="bg-gradient-to-r from-orange-500 via-brand to-purple-600 bg-clip-text text-transparent"><Tr k="catTitleB" /></span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/60">
              <Tr k="catSub" />
            </p>
          </div>
          <div className="relative mt-10">
            <CategoryCarousel items={CATEGORIES} />
          </div>
          <div className="relative mt-4 text-center">
            <ButtonLink href="/create-event" className="px-8 py-3.5 text-base">
              <Tr k="catCta" /> <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="text-center font-serif text-3xl font-bold"><Tr k="tplHeading" /></h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_LIST.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex h-28 overflow-hidden rounded-xl">
                  {t.swatch.map((c) => (
                    <div key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <h3 className="mt-3 font-semibold"><Lbl text={t.name} /></h3>
                <p className="text-sm text-foreground/60"><Lbl text={t.description} /></p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 py-6 text-center text-sm text-foreground/50">© Eventra</footer>
    </>
  );
}
