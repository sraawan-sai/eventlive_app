/** Scrolling message shown below the live video. The text is repeated so the loop has no gap. */
export function TickerBar({ text }: { text: string }) {
  const item = `${text}  •  `;
  // longer messages scroll for longer so the speed stays readable
  const dur = Math.max(12, Math.round(text.length * 0.3));
  return (
    <div role="marquee" aria-label={text} className="mt-3 overflow-hidden rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white">
      <div className="ticker-track" style={{ ["--ticker-dur" as string]: `${dur}s` }} aria-hidden>
        <span>{item.repeat(4)}</span>
        <span>{item.repeat(4)}</span>
      </div>
    </div>
  );
}
