"use client";

import { useLang } from "@/components/event/lang";
import type { UiKey } from "@/lib/ui-text";

/** Text in the visitor's language. Lets server components show translated words: <Tr k="signIn" />. */
export function Tr({ k }: { k: UiKey }) {
  return <>{useLang().ui(k)}</>;
}

/** Same for names that come from data, such as an event type or template name. */
export function Lbl({ text }: { text: string }) {
  return <>{useLang().label(text)}</>;
}
