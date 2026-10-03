"use client";

import { useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { MEDIA_KINDS, MEDIA_RULES, SINGLE_KINDS, type MediaItem, type MediaKindName } from "@/lib/media";

interface Upload {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

function put(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
    xhr.onerror = () => reject(new Error("Network error during upload. Please try again."));
    xhr.send(file);
  });
}

async function api<T>(url: string, init: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { error?: string }).error ?? "Something went wrong.");
  return d as T;
}

function Section({
  eventId,
  kind,
  items,
  setItems,
  enabled,
}: {
  eventId: string;
  kind: MediaKindName;
  items: MediaItem[];
  setItems: (fn: (prev: MediaItem[]) => MediaItem[]) => void;
  enabled: boolean;
}) {
  const rule = MEDIA_RULES[kind];
  const input = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const mine = items.filter((i) => i.kind === kind);
  const patch = (id: string, p: Partial<Upload>) => setUploads((u) => u.map((x) => (x.id === id ? { ...x, ...p } : x)));

  async function uploadOne(file: File) {
    const id = crypto.randomUUID();
    setUploads((u) => [...u, { id, name: file.name, progress: 0 }]);
    try {
      if (!rule.types.includes(file.type)) throw new Error(`Unsupported file type. ${rule.hint}`);
      if (file.size > rule.maxBytes) throw new Error(`File is too large. ${rule.hint}`);
      const { uploadUrl, key } = await api<{ uploadUrl: string; key: string }>("/api/media/upload-url", {
        method: "POST",
        body: JSON.stringify({ eventId, kind, contentType: file.type, size: file.size }),
      });
      await put(uploadUrl, file, (p) => patch(id, { progress: p }));
      const { media } = await api<{ media: MediaItem }>("/api/media", {
        method: "POST",
        body: JSON.stringify({ eventId, kind, key, contentType: file.type }),
      });
      setItems((prev) => [...(SINGLE_KINDS.includes(kind) ? prev.filter((p) => p.kind !== kind) : prev), media]);
      setUploads((u) => u.filter((x) => x.id !== id));
    } catch (e) {
      patch(id, { error: e instanceof Error ? e.message : "Upload failed." });
    }
  }

  async function onPick(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    const room = SINGLE_KINDS.includes(kind) ? 1 : Math.max(0, rule.maxCount - mine.length);
    for (const f of list.slice(0, room || 0)) await uploadOne(f); // sequential: friendlier on slow connections
    if (list.length > room && !SINGLE_KINDS.includes(kind)) {
      setUploads((u) => [...u, { id: crypto.randomUUID(), name: "", progress: 0, error: `Only ${rule.maxCount} ${rule.label.toLowerCase()} allowed.` }]);
    }
    if (input.current) input.current.value = "";
  }

  async function remove(item: MediaItem) {
    if (!confirm("Remove this file?")) return;
    try {
      await api(`/api/media/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    } catch (e) {
      setUploads((u) => [...u, { id: crypto.randomUUID(), name: "", progress: 0, error: e instanceof Error ? e.message : "Could not remove." }]);
    }
  }

  const uploading = uploads.some((u) => !u.error);
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{rule.label}</h2>
          <p className="text-xs text-foreground/60">{rule.hint}</p>
        </div>
        <Button
          variant="secondary"
          disabled={!enabled || uploading || (!SINGLE_KINDS.includes(kind) && mine.length >= rule.maxCount)}
          onClick={() => input.current?.click()}
        >
          {SINGLE_KINDS.includes(kind) && mine.length ? "Replace" : "+ Upload"}
        </Button>
        <input
          ref={input}
          type="file"
          hidden
          multiple={!SINGLE_KINDS.includes(kind)}
          accept={rule.types.join(",")}
          onChange={(e) => void onPick(e.target.files)}
        />
      </div>

      {mine.length > 0 && (
        <ul className={`mt-4 grid gap-3 ${kind === "VIDEO" ? "sm:grid-cols-2" : kind === "MUSIC" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-4"}`}>
          {mine.map((m) => (
            <li key={m.id} className="group relative overflow-hidden rounded-xl bg-black/5">
              {m.kind === "MUSIC" ? (
                <audio src={m.url} controls preload="none" className="w-full" />
              ) : m.kind === "VIDEO" ? (
                <video src={`${m.url}#t=0.1`} controls preload="metadata" playsInline className="aspect-video w-full bg-black" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => void remove(m)}
                aria-label="Remove"
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/70 text-sm text-white hover:bg-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploads.length > 0 && (
        <ul className="mt-3 space-y-2">
          {uploads.map((u) => (
            <li key={u.id} className="text-sm">
              {u.error ? (
                <p role="alert" className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-red-700">
                  <span>{u.name ? `${u.name}: ` : ""}{u.error}</span>
                  <button type="button" className="ml-2 font-semibold" onClick={() => setUploads((x) => x.filter((y) => y.id !== u.id))}>✕</button>
                </p>
              ) : (
                <>
                  <div className="flex justify-between text-xs"><span className="truncate">{u.name}</span><span>{u.progress}%</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${u.progress}%` }} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function MediaManager({ eventId, initial, configured }: { eventId: string; initial: MediaItem[]; configured: boolean }) {
  const [items, setItems] = useState(initial);
  return (
    <div className="space-y-6">
      {!configured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          File storage isn&apos;t configured yet. Add the <code>R2_*</code> values to <code>.env.local</code> and restart the server to enable uploads.
        </p>
      )}
      {MEDIA_KINDS.map((k) => (
        <Section key={k} eventId={eventId} kind={k} items={items} setItems={setItems} enabled={configured} />
      ))}
    </div>
  );
}
