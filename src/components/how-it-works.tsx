import type { ComponentType, SVGProps } from "react";
import { ArrowRightIcon, CalendarIcon, PaletteIcon, UsersIcon, VideoIcon } from "@/components/icons";
import { Tr } from "@/components/tr";
import { ButtonLink } from "@/components/ui";
import type { UiKey } from "@/lib/ui-text";

const STEPS: { Icon: ComponentType<SVGProps<SVGSVGElement>>; title: UiKey; text: UiKey }[] = [
  { Icon: CalendarIcon, title: "s1t", text: "s1x" },
  { Icon: PaletteIcon, title: "s2t", text: "s2x" },
  { Icon: UsersIcon, title: "s3t", text: "s3x" },
  { Icon: VideoIcon, title: "s4t", text: "s4x" },
];

/** Four-step explainer under the hero, with a button to the no-sign-up demo. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="inline-block rounded-full bg-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
          <Tr k="howPill" />
        </p>
        <h2 className="mt-5 font-serif text-3xl font-bold leading-tight sm:text-5xl">
          <Tr k="howTitle" />
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-foreground/60">
          <Tr k="howSub" />
        </p>

        <ol className="mt-12 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="relative rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(214,40,75,0.08)] ring-1 ring-black/5">
              <span className="absolute -top-4 left-6 grid size-9 place-items-center rounded-full bg-brand text-sm font-bold text-white shadow-md">{i + 1}</span>
              <span className="mt-2 grid size-14 place-items-center rounded-2xl bg-tint text-brand">
                <Icon width={28} height={28} />
              </span>
              <h3 className="mt-4 text-lg font-bold">
                <Tr k={title} />
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
                <Tr k={text} />
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-2">
          <ButtonLink href="/demo" className="px-8 py-3.5 text-base shadow-lg shadow-brand/25">
            <Tr k="howCta" /> <ArrowRightIcon width={18} height={18} />
          </ButtonLink>
          <p className="text-sm text-foreground/50">
            <Tr k="howNote" />
          </p>
        </div>
      </div>
    </section>
  );
}
