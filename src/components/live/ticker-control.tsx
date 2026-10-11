"use client";

import { useState } from "react";
import { Button, Card, inputCls } from "@/components/ui";

/** Owner controls for the scrolling message shown below the live video. Changes reach guests within a few seconds. */
export function TickerControl({ slug, initialText, initialOn }: { slug: string; initialText: string; initialOn: boolean }) {
  const [text, setText] = useState(initialText);
  const [on, setOn] = useState(initialOn);
  const [saved, setSaved] = useState(initialText);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();

  async function save(nextOn: boolean) {
    setBusy(true);
    setMsg(undefined);
    try {
      const r = await fetch(`/api/events/${slug}/ticker`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on: nextOn, text }),
      });
      const d = (await r.json().catch(() => ({}))) as { error?: string; text?: string };
      if (!r.ok) throw new Error(d.error ?? "Could not save.");
      setOn(nextOn);
      setSaved(d.text ?? text);
      setMsg({ ok: true, text: nextOn ? "Showing below the live video." : "Hidden." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not save." });
    } finally {
      setBusy(false);
    }
  }

  const changed = text.trim() !== saved.trim();
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Scrolling message</h2>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${on ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"}`}>
          {on ? "ON" : "OFF"}
        </span>
      </div>
      <p className="text-xs text-foreground/60">Scrolls below the live video, like a news ticker. Guests see changes within a few seconds.</p>
      <textarea
        className={`${inputCls} mt-3 min-h-20`}
        value={text}
        maxLength={200}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Aarti starts at 6 PM  •  Annadanam after the pooja"
        aria-label="Scrolling message"
      />
      <div className="mt-1 text-right text-xs text-foreground/50">{text.length}/200</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {on ? (
          <>
            <Button variant="danger" onClick={() => void save(false)} disabled={busy}>Hide</Button>
            <Button onClick={() => void save(true)} disabled={busy || !changed || !text.trim()}>Update text</Button>
          </>
        ) : (
          <Button onClick={() => void save(true)} disabled={busy || !text.trim()}>Show</Button>
        )}
        {msg && <span role="status" className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</span>}
      </div>
    </Card>
  );
}
