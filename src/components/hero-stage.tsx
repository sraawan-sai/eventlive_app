"use client";

import { useEffect, useRef, useState, type ComponentType, type PointerEvent, type SVGProps } from "react";
import { BriefcaseIcon, CakeIcon, CameraIcon, EyeIcon, HeartIcon, MusicIcon, PlayIcon, SendIcon } from "@/components/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface Slide {
  image: string;
  viewers: string;
  chat: { name: string; text: string; tone: string }[];
}

const PINK = "from-pink-400 to-rose-500";
const AMBER = "from-amber-400 to-orange-500";
const PURPLE = "from-purple-400 to-fuchsia-500";

const SLIDES: Slide[] = [
  {
    image: "wedding",
    viewers: "1.2K",
    chat: [
      { name: "Priya", text: "Beautiful! ❤️", tone: PINK },
      { name: "Rahul", text: "Amazing event! 🎉", tone: AMBER },
      { name: "Sneha", text: "Congratulations! ❤️", tone: PURPLE },
    ],
  },
  {
    image: "birthday",
    viewers: "486",
    chat: [
      { name: "Anita", text: "Happy birthday! 🎂", tone: PINK },
      { name: "Kiran", text: "That cake looks yum", tone: AMBER },
      { name: "Ravi", text: "Many happy returns!", tone: PURPLE },
    ],
  },
  {
    image: "concert",
    viewers: "2.4K",
    chat: [
      { name: "Arjun", text: "What a show! 🔥", tone: AMBER },
      { name: "Meera", text: "The sound is superb", tone: PURPLE },
      { name: "Dev", text: "Encore! Encore!", tone: PINK },
    ],
  },
  {
    image: "graduation",
    viewers: "312",
    chat: [
      { name: "Neha", text: "So proud of you! 🎓", tone: PURPLE },
      { name: "Sam", text: "Congrats, graduate!", tone: PINK },
      { name: "Isha", text: "Well deserved ❤️", tone: AMBER },
    ],
  },
  {
    image: "corporate",
    viewers: "874",
    chat: [
      { name: "Vikram", text: "Great keynote", tone: PURPLE },
      { name: "Pooja", text: "Slides please! 🙏", tone: PINK },
      { name: "Manoj", text: "Joined from Pune", tone: AMBER },
    ],
  },
];

const FLOATERS: { label: string; image: string; Icon: IconType; pos: string; tilt: string; delay: string }[] = [
  { label: "Wedding", image: "religious", Icon: CameraIcon, pos: "left-0 top-[8%]", tilt: "-rotate-6", delay: "0s" },
  { label: "Concert", image: "concert", Icon: MusicIcon, pos: "-left-2 top-[54%]", tilt: "-rotate-3", delay: "-1.5s" },
  { label: "Birthday", image: "birthday", Icon: CakeIcon, pos: "right-0 top-[14%]", tilt: "rotate-6", delay: "-3s" },
  { label: "Corporate", image: "corporate", Icon: BriefcaseIcon, pos: "-right-2 top-[58%]", tilt: "-rotate-6", delay: "-4.5s" },
];

const SLIDE_MS = 4000;

/** Extra layers behind the front frame; with the phone turning, they read as the thickness of the device. */
const EDGE_LAYERS = [-4, -8, -12, -16];

function Phone({ active }: { active: number }) {
  return (
    <div className="relative w-[250px] rotate-[4deg] [transform-style:preserve-3d] sm:w-[290px]">
      {EDGE_LAYERS.map((z) => (
        <div
          key={z}
          className="absolute inset-0 rounded-[2.8rem] bg-neutral-700"
          style={{ transform: `translateZ(${z}px)`, filter: `brightness(${1 + z / 40})` }}
          aria-hidden="true"
        />
      ))}
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[18%] h-8 w-[4px] rounded-l bg-neutral-700 [transform:translateZ(-6px)]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[26%] h-14 w-[4px] rounded-l bg-neutral-700 [transform:translateZ(-6px)]" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[24%] h-20 w-[4px] rounded-r bg-neutral-700 [transform:translateZ(-6px)]" aria-hidden="true" />

      <div className="relative rounded-[2.8rem] border-[8px] border-neutral-900 bg-neutral-900 shadow-[0_30px_70px_rgba(60,20,40,0.35)] [transform:translateZ(2px)]">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[2.2rem] bg-neutral-800">
          {SLIDES.map((s, i) => (
            <div key={s.image} className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/categories/${s.image}.jpg`}
                alt=""
                className={`h-full w-full object-cover ${i === active ? "kenburns" : ""}`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
          {/* glass shine */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 mx-auto mt-2 h-5 w-24 rounded-full bg-black" />

          <div className="absolute left-3 top-9 flex items-center gap-2 text-white">
            <span className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-extrabold tracking-wide">
              <span className="live-dot">●</span> LIVE
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs font-semibold backdrop-blur">
              <EyeIcon width={14} height={14} /> {SLIDES[active].viewers}
            </span>
          </div>

          <ul key={active} className="absolute inset-x-3 bottom-16 space-y-2">
            {SLIDES[active].chat.map((c, i) => (
              <li
                key={c.name}
                style={{ animationDelay: `${0.3 + i * 0.35}s` }}
                className="chat-in flex w-fit items-center gap-2 rounded-2xl bg-black/35 py-1.5 pl-1.5 pr-3 text-white backdrop-blur-sm"
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.tone} text-xs font-bold`}>{c.name[0]}</span>
                <span className="text-[11px] leading-tight">
                  <b className="block font-semibold">{c.name}</b>
                  {c.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
            <span className="flex-1 rounded-full bg-black/45 px-4 py-2.5 text-[11px] text-white/60 backdrop-blur">Send a message...</span>
            <span className="grid size-9 place-items-center rounded-full bg-white/15 text-red-500 backdrop-blur">
              <HeartIcon width={18} height={18} fill="currentColor" />
            </span>
            <span className="grid size-9 place-items-center rounded-full text-white">
              <SendIcon width={18} height={18} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The phone mock on the home page: it sways on its own, follows the pointer in 3D, and cycles through event photos.
 * Pointer tilt is written straight to CSS variables so moving the mouse never re-renders React.
 */
export function HeroStage() {
  const tilt = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.current?.style.setProperty("--ry", `${x * 26}deg`);
    tilt.current?.style.setProperty("--rx", `${-y * 18}deg`);
  }

  function onLeave() {
    tilt.current?.style.setProperty("--ry", "0deg");
    tilt.current?.style.setProperty("--rx", "0deg");
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto flex h-[560px] w-full max-w-[640px] items-center justify-center [perspective:1400px] sm:h-[620px]"
    >
      <div className="absolute inset-4 rounded-full border border-dashed border-brand/30" aria-hidden="true" />
      <div className="absolute inset-x-10 inset-y-16 rounded-full bg-gradient-to-b from-rose-100/80 to-transparent" aria-hidden="true" />
      <span
        className="float-y absolute right-[6%] top-0 hidden size-16 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-brand text-white shadow-lg sm:grid"
        aria-hidden="true"
      >
        <PlayIcon width={28} height={28} fill="currentColor" />
      </span>

      <div
        ref={tilt}
        className="relative z-10 [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transition:transform_0.25s_ease-out]"
      >
        <div className="phone-sway [transform-style:preserve-3d]">
          <Phone active={active} />
        </div>
      </div>

      {FLOATERS.map((f) => (
        <div key={f.label} className={`absolute z-20 hidden w-[170px] md:block ${f.pos} ${f.tilt}`}>
          <div className="float-y" style={{ animationDelay: f.delay }}>
            <div className="relative h-[120px] overflow-hidden rounded-2xl shadow-xl ring-4 ring-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/categories/${f.image}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <span className="-mt-5 ml-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm font-semibold shadow-lg">
              <f.Icon width={16} height={16} className="text-brand" /> {f.label}
            </span>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center gap-2" role="tablist" aria-label="Preview events">
        {SLIDES.map((s, i) => (
          <button
            key={s.image}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${s.image} preview`}
            onClick={() => setActive(i)}
            className={`h-2.5 rounded-full transition-all ${i === active ? "w-6 bg-brand" : "w-2.5 bg-black/20 hover:bg-black/35"}`}
          />
        ))}
      </div>
    </div>
  );
}
