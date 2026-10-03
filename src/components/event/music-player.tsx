"use client";

import { useRef, useState } from "react";
import { useLang } from "./lang";

/** Never autoplays: music starts only when the guest taps the button. */
export function MusicPlayer({ url, className }: { url: string; className: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const { tr } = useLang();

  async function toggle() {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={ref} src={url} loop preload="none" onEnded={() => setPlaying(false)} />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? tr("musicPause") : tr("musicPlay")}
        className={`fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 shadow-lg ${className}`}
      >
        <span aria-hidden>{playing ? "⏸" : "♪"}</span>
        <span className="text-sm">{playing ? tr("musicPause") : tr("musicPlay")}</span>
      </button>
    </>
  );
}
