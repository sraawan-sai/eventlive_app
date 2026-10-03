"use client";

import { useRef, useState, useTransition } from "react";
import { addSponsorAction, deleteSponsorAction, type SponsorItem } from "@/lib/actions/sponsors";
import { SPONSOR_RULE } from "@/lib/media";
import { Button, Card, Field, inputCls } from "@/components/ui";

async function presign(eventId: string, file: File) {
  const r = await fetch("/api/media/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, kind: "SPONSOR", contentType: file.type, size: file.size }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { error?: string }).error ?? "Could not start the upload.");
  return d as { uploadUrl: string; key: string };
}

async function put(url: string, file: File) {
  const r = await fetch(url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!r.ok) throw new Error("Upload failed. Please try again.");
}

export function SponsorManager({ eventId, initial, storageReady }: { eventId: string; initial: SponsorItem[]; storageReady: boolean }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [site, setSite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [display, setDisplay] = useState<"logo" | "photo">("logo");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function pick(f: File | null) {
    setError(undefined);
    if (f && !SPONSOR_RULE.types.includes(f.type)) return setError(`Unsupported file. ${SPONSOR_RULE.hint}`);
    if (f && f.size > SPONSOR_RULE.maxBytes) return setError(`Logo is too large. ${SPONSOR_RULE.hint}`);
    setLogo(f);
  }

  function add() {
    setError(undefined);
    if (!name.trim()) return setError("Enter the sponsor name.");
    start(async () => {
      try {
        let key: string | undefined;
        if (logo) {
          const p = await presign(eventId, logo);
          await put(p.uploadUrl, logo);
          key = p.key;
        }
        const res = await addSponsorAction({ eventId, name, tier, websiteUrl: site, display, logoKey: key, logoType: logo?.type });
        if (!res.ok) return setError(res.error);
        setItems((s) => [...s, res.sponsor]);
        setName("");
        setTier("");
        setSite("");
        setLogo(null);
        setDisplay("logo");
        if (fileRef.current) fileRef.current.value = "";
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function remove(s: SponsorItem) {
    if (!confirm(`Remove ${s.name}?`)) return;
    start(async () => {
      const r = await deleteSponsorAction(s.id);
      if (r.ok) setItems((x) => x.filter((i) => i.id !== s.id));
      else setError("Could not remove the sponsor.");
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">Sponsors</h2>
      <p className="text-xs text-foreground/60">Shown in a &ldquo;Our Sponsors&rdquo; section on your event website.</p>

      {items.length > 0 && (
        <ul className="mb-4 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((s) => (
            <li key={s.id} className="relative rounded-xl bg-black/[0.03] p-3 text-center">
              <div className="grid h-16 place-items-center">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt="" className={s.display === "photo" ? "h-16 w-full rounded object-cover" : "max-h-16 max-w-full object-contain"} />
                ) : (
                  <span className="text-2xl">🙏</span>
                )}
              </div>
              <p className="mt-1 truncate text-sm font-semibold">{s.name}</p>
              {s.tier && <p className="truncate text-xs text-foreground/60">{s.tier}</p>}
              <button
                type="button"
                onClick={() => remove(s)}
                disabled={pending}
                aria-label={`Remove ${s.name}`}
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/70 text-xs text-white hover:bg-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Sponsor name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        </Field>
        <Field label="Title (optional)" hint="e.g. Title Sponsor, Gold, Annadanam Partner">
          <input className={inputCls} value={tier} onChange={(e) => setTier(e.target.value)} maxLength={60} />
        </Field>
        <Field label="Website (optional)">
          <input type="url" className={inputCls} value={site} onChange={(e) => setSite(e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Logo or photo (optional)" hint={storageReady ? SPONSOR_RULE.hint : "Logo uploads need file storage to be set up. You can still add the name."}>
          <input
            ref={fileRef}
            type="file"
            accept={SPONSOR_RULE.types.join(",")}
            disabled={!storageReady}
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-tint file:px-3 file:py-2 file:font-semibold file:text-brand"
          />
        </Field>
        <Field label="Show image as" hint="Photo = large card that fills the frame. Logo = fits inside a smaller card without cropping.">
          <select className={inputCls} value={display} onChange={(e) => setDisplay(e.target.value as "logo" | "photo")}>
            <option value="logo">Logo (fit inside)</option>
            <option value="photo">Photo (large card)</option>
          </select>
        </Field>
      </div>
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button className="mt-4" onClick={add} disabled={pending}>
        {pending ? "Adding…" : "+ Add sponsor"}
      </Button>
    </Card>
  );
}
