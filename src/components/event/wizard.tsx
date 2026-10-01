"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createEventAction } from "@/lib/actions/events";
import { EVENT_TYPES, EVENT_TYPE_CONFIG, type EventType } from "@/lib/event-types";
import { slugify } from "@/lib/slugify";
import { Button, ButtonLink, Card, Field } from "@/components/ui";
import { InfoFields, VenueFields, type EventFormValues } from "./event-fields";
import { TemplatePicker } from "./template-picker";
import { EventSite } from "./event-site";
import { valuesToSiteEvent } from "./to-site-event";

const STEPS = ["Type", "Details", "Venue", "Template", "Preview", "Publish"];

const INITIAL: EventFormValues = {
  type: "WEDDING",
  name: "",
  hostOne: "",
  hostTwo: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venueName: "",
  venueAddress: "",
  coverImageUrl: "",
  template: "elegant",
  slug: "",
};

export function EventWizard() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<EventFormValues>(INITIAL);
  const [nameTouched, setNameTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState<string>();
  const [created, setCreated] = useState<{ slug: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  function set<K extends keyof EventFormValues>(k: K, val: EventFormValues[K]) {
    setV((prev) => {
      const next = { ...prev, [k]: val };
      if (k === "name") setNameTouched(true);
      if (!nameTouched && (k === "hostOne" || k === "hostTwo")) {
        const s = EVENT_TYPE_CONFIG[next.type].suggestName(next.hostOne.trim(), next.hostTwo.trim());
        if (s) next.name = s;
      }
      return next;
    });
  }

  function pickType(t: EventType) {
    setV((p) => ({ ...p, type: t, hostOne: "", hostTwo: "" }));
    setStep(1);
  }

  const slugPreview = v.slug || slugify(v.name) || "your-event";
  const missingDetails = !v.name.trim() || !v.eventDate;

  function next() {
    if (step === 1 && missingDetails) {
      setErrors({
        name: v.name.trim() ? undefined : ["Enter an event title"],
        eventDate: v.eventDate ? undefined : ["Pick a date"],
      });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 5));
  }

  function publish() {
    setError(undefined);
    start(async () => {
      const res = await createEventAction(v);
      if (res.ok) {
        setCreated({ slug: res.slug, id: res.id });
      } else {
        setError(res.error);
        setErrors(res.fieldErrors ?? {});
        if (res.fieldErrors?.name || res.fieldErrors?.eventDate) setStep(1);
        else if (res.fieldErrors?.venueName || res.fieldErrors?.venueAddress || res.fieldErrors?.coverImageUrl) setStep(2);
      }
    });
  }

  if (created) {
    const path = `/event/${created.slug}`;
    return (
      <Card className="mx-auto max-w-xl p-8 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-3 font-serif text-3xl font-bold">Your event website is ready!</h1>
        <p className="mt-4 rounded-xl bg-tint px-4 py-3 font-mono text-sm break-all">{path}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(`${window.location.origin}${path}`).catch(() => {});
              setCopied(true);
            }}
          >
            {copied ? "✓ Copied" : "Copy Link"}
          </Button>
          <ButtonLink href={path}>View Website</ButtonLink>
          <ButtonLink href={`/dashboard/events/${created.id}`} variant="secondary">Add photos &amp; video</ButtonLink>
          <ButtonLink href="/dashboard" variant="ghost">Go to Dashboard</ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 0 ? (
            <button type="button" aria-label="Back" onClick={() => setStep((s) => s - 1)} disabled={pending} className="grid size-9 place-items-center rounded-full hover:bg-black/5">←</button>
          ) : (
            <Link href="/dashboard" aria-label="Back to dashboard" className="grid size-9 place-items-center rounded-full hover:bg-black/5">←</Link>
          )}
          <h1 className="font-serif text-xl font-bold sm:text-2xl">Create Your Event</h1>
        </div>
        <span className="text-sm text-foreground/60">Step {step + 1} of 6</span>
      </div>
      <ol className="mb-6 flex items-start" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="relative flex flex-1 flex-col items-center">
            {i > 0 && <span className={`absolute right-1/2 top-3 h-0.5 w-full ${i <= step ? "bg-brand" : "bg-black/10"}`} aria-hidden />}
            <span
              className={`relative z-10 grid size-6 place-items-center rounded-full text-[11px] font-bold ${i < step ? "bg-brand text-white" : i === step ? "bg-brand text-white ring-4 ring-brand/20" : "border-2 border-black/15 bg-white text-transparent"}`}
            >
              {i < step ? "✓" : i === step ? i + 1 : "·"}
            </span>
            <span className={`mt-1.5 hidden text-[11px] sm:block ${i === step ? "font-semibold text-brand" : "text-foreground/50"}`}>{label}</span>
          </li>
        ))}
      </ol>

      <Card className="p-6">
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold">Select Event Type</h2>
            <p className="text-sm text-foreground/60">Choose the type of event you&apos;re creating</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => pickType(t)}
                  className={`rounded-2xl p-4 text-center ring-2 transition hover:ring-brand/60 ${v.type === t ? "ring-brand bg-tint" : "ring-black/10"}`}
                >
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-tint text-2xl">{EVENT_TYPE_CONFIG[t].emoji}</div>
                  <div className="mt-1 text-sm font-semibold">{EVENT_TYPE_CONFIG[t].label}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="mb-5 text-xl font-bold">Event information</h2>
            <InfoFields v={v} set={set} errors={errors} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-5 text-xl font-bold">Venue</h2>
            <VenueFields v={v} set={set} errors={errors} />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="mb-5 text-xl font-bold">Choose a template</h2>
            <TemplatePicker value={v.template} onChange={(id) => set("template", id)} />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="mb-4 text-xl font-bold">Preview</h2>
            <div className="h-[70vh] overflow-y-auto rounded-xl ring-1 ring-black/10">
              <EventSite event={valuesToSiteEvent(v, slugPreview)} />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="mb-2 text-xl font-bold">Ready to publish</h2>
            <p className="mb-5 text-foreground/70">Your website will be available at this link. You can change it later.</p>
            <Field label="Website link" error={errors.slug?.[0]} hint="Leave as is, or customise it. We add a number if it is taken.">
              <div className="flex items-center rounded-xl border border-black/15 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                <span className="pl-3.5 text-sm text-foreground/50">/event/</span>
                <input
                  className="w-full rounded-xl bg-transparent px-1 py-2.5 outline-none"
                  value={v.slug}
                  placeholder={slugPreview}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>
            </Field>
            {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          </>
        )}
      </Card>

      {step > 0 && (
        <div className="mt-5 flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={pending}>← Back</Button>
          {step < 5 ? (
            <Button onClick={next}>Next →</Button>
          ) : (
            <Button onClick={publish} disabled={pending}>{pending ? "Publishing…" : "Publish"}</Button>
          )}
        </div>
      )}
    </div>
  );
}
