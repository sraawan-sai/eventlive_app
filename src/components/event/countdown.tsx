"use client";

import { useEffect, useState } from "react";

function parts(target: number, now: number) {
  const s = Math.max(0, Math.floor((target - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, over: target <= now };
}

export function Countdown({ date, time, boxClass }: { date: string; time: string | null; boxClass: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = (time ?? "00:00").split(":").map(Number);
  const target = new Date(y, mo - 1, d, h, mi).getTime();

  if (now === null) return <div className="h-[76px]" aria-hidden />;
  const c = parts(target, now);
  if (c.over) return <p className="text-lg font-semibold">The celebration has begun! 🎉</p>;

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="timer" aria-label="Countdown to the event">
      {(
        [
          ["Days", c.d],
          ["Hours", c.h],
          ["Mins", c.m],
          ["Secs", c.s],
        ] as const
      ).map(([label, v]) => (
        <div key={label} className={`w-[68px] px-1 py-3 text-center sm:w-20 ${boxClass}`}>
          <div className="text-2xl font-bold tabular-nums sm:text-3xl">{String(v).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
        </div>
      ))}
    </div>
  );
}
