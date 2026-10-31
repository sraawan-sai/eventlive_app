"use client";

import { TEMPLATE_LIST } from "@/lib/templates";
import { useLang } from "./lang";

export function TemplatePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { label } = useLang();
  return (
    <div role="radiogroup" aria-label="Template" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TEMPLATE_LIST.map((t) => {
        const on = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(t.id)}
            className={`rounded-2xl bg-white p-4 text-left ring-2 transition ${on ? "ring-brand" : "ring-black/5 hover:ring-brand/40"}`}
          >
            <div className="flex h-24 overflow-hidden rounded-xl">
              {t.swatch.map((c) => (
                <div key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="mt-3 font-semibold">{label(t.name)} {on && "✓"}</p>
            <p className="text-sm text-foreground/60">{label(t.description)}</p>
          </button>
        );
      })}
    </div>
  );
}
