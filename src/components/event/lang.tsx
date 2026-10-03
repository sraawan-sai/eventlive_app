"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DICT, LANGS, LANG_LABEL, TAGLINES, type Key, type Lang } from "@/lib/i18n";

const STORE_KEY = "eventra-lang";
const EVT = "eventra-lang-change";

function read(): Lang {
  try {
    const v = localStorage.getItem(STORE_KEY);
    return LANGS.includes(v as Lang) ? (v as Lang) : "en";
  } catch {
    return "en";
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (k: Key) => string;
  tagline: (type: string, fallback: string) => string;
}
const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  tr: (k) => DICT.en[k],
  tagline: (_t, f) => f,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, read, () => "en" as Lang);
  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(STORE_KEY, l);
    } catch {
      /* private mode: still switch for this view */
    }
    window.dispatchEvent(new Event(EVT));
  }, []);
  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      tr: (k) => DICT[lang][k] ?? DICT.en[k],
      tagline: (type, fallback) => TAGLINES[lang][type] ?? fallback,
    }),
    [lang, setLang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function LangToggle({ className }: { className: string }) {
  const { lang, setLang, tr } = useLang();
  return (
    <div role="group" aria-label={tr("language")} className="flex items-center gap-1 text-xs">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded px-2 py-1 ${lang === l ? `font-bold underline underline-offset-4 ${className}` : "opacity-70 hover:opacity-100"}`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
