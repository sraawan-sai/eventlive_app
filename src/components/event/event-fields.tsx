"use client";

import { EVENT_TYPE_CONFIG, type EventType } from "@/lib/event-types";
import { Field, inputCls } from "@/components/ui";

export interface EventFormValues {
  type: EventType;
  name: string;
  hostOne: string;
  hostTwo: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  coverImageUrl: string;
  template: string;
  slug: string;
}

type Errors = Record<string, string[] | undefined>;
type Set = <K extends keyof EventFormValues>(k: K, v: EventFormValues[K]) => void;

export function InfoFields({ v, set, errors = {} }: { v: EventFormValues; set: Set; errors?: Errors }) {
  const cfg = EVENT_TYPE_CONFIG[v.type];
  return (
    <div className="space-y-4">
      {cfg.hostOneLabel && (
        <div className={cfg.hostTwoLabel ? "grid gap-4 sm:grid-cols-2" : ""}>
          <Field label={cfg.hostOneLabel} error={errors.hostOne?.[0]}>
            <input className={inputCls} value={v.hostOne} onChange={(e) => set("hostOne", e.target.value)} placeholder={v.type === "WEDDING" ? "Kuslatha" : ""} />
          </Field>
          {cfg.hostTwoLabel && (
            <Field label={cfg.hostTwoLabel} error={errors.hostTwo?.[0]}>
              <input className={inputCls} value={v.hostTwo} onChange={(e) => set("hostTwo", e.target.value)} placeholder={v.type === "WEDDING" ? "Sravan" : ""} />
            </Field>
          )}
        </div>
      )}
      <Field label={cfg.nameLabel} error={errors.name?.[0]}>
        <input className={inputCls} value={v.name} onChange={(e) => set("name", e.target.value)} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={cfg.dateLabel} error={errors.eventDate?.[0]}>
          <input type="date" className={inputCls} value={v.eventDate} onChange={(e) => set("eventDate", e.target.value)} required />
        </Field>
        <Field label="Start time" error={errors.startTime?.[0]}>
          <input type="time" className={inputCls} value={v.startTime} onChange={(e) => set("startTime", e.target.value)} />
        </Field>
        <Field label="End time" error={errors.endTime?.[0]}>
          <input type="time" className={inputCls} value={v.endTime} onChange={(e) => set("endTime", e.target.value)} />
        </Field>
      </div>
      <Field label="Description" error={errors.description?.[0]}>
        <textarea className={`${inputCls} min-h-28`} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="A short message for your guests" />
      </Field>
    </div>
  );
}

export function VenueFields({ v, set, errors = {} }: { v: EventFormValues; set: Set; errors?: Errors }) {
  return (
    <div className="space-y-4">
      <Field label="Venue name" error={errors.venueName?.[0]}>
        <input className={inputCls} value={v.venueName} onChange={(e) => set("venueName", e.target.value)} />
      </Field>
      <Field label="Venue address" error={errors.venueAddress?.[0]}>
        <textarea className={`${inputCls} min-h-20`} value={v.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} />
      </Field>
      <Field label="Cover image URL (optional)" hint="Paste a link to a photo, or leave empty to use the default illustration." error={errors.coverImageUrl?.[0]}>
        <input type="url" className={inputCls} value={v.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} placeholder="https://…" />
      </Field>
    </div>
  );
}
