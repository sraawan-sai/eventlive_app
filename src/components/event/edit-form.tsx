"use client";

import { useState, useTransition } from "react";
import { deleteEventAction, updateEventAction } from "@/lib/actions/events";
import { slugify } from "@/lib/slugify";
import { Button, ButtonLink, Card, Field, inputCls } from "@/components/ui";
import { InfoFields, VenueFields, type EventFormValues } from "./event-fields";
import { TemplatePicker } from "./template-picker";

interface ScheduleRow {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export function EditEventForm({
  id,
  status,
  initial,
  schedule: initialSchedule,
}: {
  id: string;
  status: string;
  initial: EventFormValues;
  schedule: ScheduleRow[];
}) {
  const [v, setV] = useState(initial);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [published, setPublished] = useState(status !== "DRAFT");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();
  const [pending, start] = useTransition();
  const locked = status === "LIVE" || status === "ENDED";

  function set<K extends keyof EventFormValues>(k: K, val: EventFormValues[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }
  function setRow(i: number, patch: Partial<ScheduleRow>) {
    setSchedule((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function save() {
    setMsg(undefined);
    start(async () => {
      const res = await updateEventAction(id, v, schedule, published ? "PUBLISHED" : "DRAFT");
      if (res.ok) {
        setErrors({});
        setV((p) => ({ ...p, slug: res.slug }));
        setMsg({ ok: true, text: "Saved." });
      } else {
        setErrors(res.fieldErrors ?? {});
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold">Edit event</h1>
        <ButtonLink href={`/event/${initial.slug}`} variant="secondary">View Website</ButtonLink>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">Details</h2>
        <InfoFields v={v} set={set} errors={errors} />
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold">Venue &amp; cover</h2>
        <VenueFields v={v} set={set} errors={errors} />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Schedule</h2>
        <div className="space-y-3">
          {schedule.map((r, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-black/[0.03] p-3 sm:grid-cols-[110px_110px_1fr_auto]">
              <input aria-label="Start time" type="time" required className={inputCls} value={r.startTime} onChange={(e) => setRow(i, { startTime: e.target.value })} />
              <input aria-label="End time" type="time" className={inputCls} value={r.endTime} onChange={(e) => setRow(i, { endTime: e.target.value })} />
              <div className="space-y-2">
                <input aria-label="Title" placeholder="Title (e.g. Muhurtham)" className={inputCls} value={r.title} onChange={(e) => setRow(i, { title: e.target.value })} />
                <input aria-label="Description" placeholder="Description (optional)" className={inputCls} value={r.description} onChange={(e) => setRow(i, { description: e.target.value })} />
              </div>
              <Button variant="ghost" onClick={() => setSchedule((s) => s.filter((_, j) => j !== i))} aria-label="Remove item">✕</Button>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => setSchedule((s) => [...s, { title: "", description: "", startTime: "", endTime: "" }])}
        >
          + Add schedule item
        </Button>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Template</h2>
        <TemplatePicker value={v.template} onChange={(t) => set("template", t)} />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Link &amp; visibility</h2>
        <Field label="Website link" error={errors.slug?.[0]}>
          <div className="flex items-center rounded-xl border border-black/15 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="pl-3.5 text-sm text-foreground/50">/event/</span>
            <input className="w-full rounded-xl bg-transparent px-1 py-2.5 outline-none" value={v.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
          </div>
        </Field>
        {!locked && (
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="size-4 accent-[#7a2e3a]" />
            Published (visible to anyone with the link)
          </label>
        )}
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-black/5 bg-background/90 px-4 py-3 backdrop-blur">
        <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
        <ButtonLink href="/dashboard" variant="ghost">Back</ButtonLink>
        {msg && (
          <span role="status" className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</span>
        )}
        <form
          action={deleteEventAction.bind(null, id)}
          className="ml-auto"
          onSubmit={(e) => {
            if (!confirm("Delete this event permanently?")) e.preventDefault();
          }}
        >
          <Button variant="danger" type="submit">Delete</Button>
        </form>
      </div>
    </div>
  );
}
