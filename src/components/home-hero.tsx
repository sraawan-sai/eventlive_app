import type { ComponentType, SVGProps } from "react";
import { ButtonLink } from "@/components/ui";
import { ArrowRightIcon, BoltIcon, MonitorIcon, PaletteIcon, PlayIcon, UsersIcon, VideoIcon } from "@/components/icons";
import { HeroStage } from "@/components/hero-stage";
import { Tr } from "@/components/tr";
import type { UiKey } from "@/lib/ui-text";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const FEATURES: { Icon: IconType; title: UiKey; text: UiKey }[] = [
  { Icon: PaletteIcon, title: "f1t", text: "f1x" },
  { Icon: VideoIcon, title: "f2t", text: "f2x" },
  { Icon: BoltIcon, title: "f3t", text: "f3x" },
  { Icon: UsersIcon, title: "f4t", text: "f4x" },
  { Icon: MonitorIcon, title: "f5t", text: "f5x" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-rose-100/70">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-rose-100/70 blur-2xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-12 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-tint px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand">
            <span className="size-2 rounded-full bg-brand" aria-hidden="true" /> <Tr k="heroPill" />
          </p>
          <h1 className="mt-6 break-words font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <Tr k="heroTitleA" />{" "}
            <span className="bg-gradient-to-r from-orange-500 to-brand bg-clip-text text-transparent"><Tr k="heroTitleB" /></span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/65">
            <Tr k="heroText" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/create-event" className="px-8 py-3.5 text-base shadow-lg shadow-brand/25">
              <Tr k="heroCta1" /> <ArrowRightIcon width={18} height={18} />
            </ButtonLink>
            <ButtonLink href="#templates" variant="secondary" className="px-8 py-3.5 text-base">
              <PlayIcon width={18} height={18} fill="currentColor" /> <Tr k="heroCta2" />
            </ButtonLink>
          </div>
        </div>

        <HeroStage />
      </div>

      <ul id="features" className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-6 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ Icon, title, text }, i) => (
          <li key={title} className={`flex items-center gap-4 ${i > 0 ? "lg:border-l lg:border-black/10 lg:pl-5" : ""}`}>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-tint text-brand">
              <Icon width={26} height={26} />
            </span>
            <span>
              <b className="block text-sm font-bold"><Tr k={title} /></b>
              <span className="text-sm leading-snug text-foreground/60"><Tr k={text} /></span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
