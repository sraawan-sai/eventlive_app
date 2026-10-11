export const TRANSLATION_LANGS = ["te", "hi"] as const;
export type TransLang = (typeof TRANSLATION_LANGS)[number];
export const TRANSLATION_LABEL: Record<TransLang, string> = { te: "Telugu (తెలుగు)", hi: "Hindi (हिन्दी)" };

export interface TransFields {
  name: string;
  description: string;
  hostOne: string;
  hostTwo: string;
}
export type Translations = Record<TransLang, TransFields>;

export const emptyTranslations = (): Translations => ({
  te: { name: "", description: "", hostOne: "", hostTwo: "" },
  hi: { name: "", description: "", hostOne: "", hostTwo: "" },
});

/** Turns whatever is stored in the database JSON column into a safe, fully-populated shape. */
export function normalizeTranslations(raw: unknown): Translations {
  const out = emptyTranslations();
  if (!raw || typeof raw !== "object") return out;
  for (const lang of TRANSLATION_LANGS) {
    const block = (raw as Record<string, unknown>)[lang];
    if (!block || typeof block !== "object") continue;
    for (const k of ["name", "description", "hostOne", "hostTwo"] as const) {
      const v = (block as Record<string, unknown>)[k];
      if (typeof v === "string") out[lang][k] = v;
    }
  }
  return out;
}
