import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui";
import { EVENT_TYPES, EVENT_TYPE_CONFIG } from "@/lib/event-types";
import { TEMPLATE_LIST } from "@/lib/templates";

const FEATURES = [
  { icon: "🎨", title: "Beautiful Templates", text: "Professional designs for every occasion" },
  { icon: "📹", title: "Live Streaming", text: "Broadcast from any device" },
  { icon: "⚡", title: "Easy to Use", text: "Create in minutes" },
  { icon: "👨‍👩‍👧", title: "Share with Everyone", text: "Invite family and friends" },
  { icon: "🖥️", title: "Access Anywhere", text: "Watch on phone, tablet or laptop" },
];

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[230px] sm:w-[260px]">
      <div className="rounded-[2.4rem] border-[7px] border-neutral-900 bg-neutral-900 shadow-2xl">
        <div className="relative aspect-[9/18] overflow-hidden rounded-[1.9rem] bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400">
          <div className="absolute inset-x-0 top-0 mx-auto mt-2 h-4 w-20 rounded-full bg-black/80" />
          <span className="absolute left-3 top-9 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">● LIVE</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cover-wedding.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
            <div className="mx-auto w-fit rounded-full bg-brand px-6 py-2 text-xs font-bold text-white">Start Live</div>
          </div>
        </div>
      </div>
      <p className="absolute -right-2 bottom-10 hidden -rotate-6 font-serif text-sm italic text-foreground/60 lg:block">
        From your phone
        <br />
        to the world
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader marketing />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-white via-tint to-rose-100/60">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="inline-block rounded-md bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand ring-1 ring-brand/20">
                Live moments, memories forever.
              </p>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.1] sm:text-6xl">
                Create Your Event Website &amp; <span className="text-brand">Go Live</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-foreground/70">
                Beautiful event websites for weddings, birthdays, religious events and more. Share it with everyone, and livestream from your phone soon.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/create-event" className="px-7 py-3 text-base">Get Started Free</ButtonLink>
                <ButtonLink href="#templates" variant="secondary" className="px-7 py-3 text-base">▶ See Templates</ButtonLink>
              </div>
            </div>
            <PhoneMock />
          </div>
          <div id="features" className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 pb-14 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm ring-1 ring-black/5">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-foreground/60">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-serif text-3xl font-bold">For every kind of celebration</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EVENT_TYPES.map((t) => (
              <li key={t} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-tint text-2xl">{EVENT_TYPE_CONFIG[t].emoji}</div>
                <div className="mt-2 text-sm font-semibold">{EVENT_TYPE_CONFIG[t].label}</div>
              </li>
            ))}
          </ul>
        </section>

        <section id="templates" className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="text-center font-serif text-3xl font-bold">Beautiful templates</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATE_LIST.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex h-28 overflow-hidden rounded-xl">
                  {t.swatch.map((c) => (
                    <div key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <h3 className="mt-3 font-semibold">{t.name}</h3>
                <p className="text-sm text-foreground/60">{t.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 py-6 text-center text-sm text-foreground/50">© EventLive</footer>
    </>
  );
}
