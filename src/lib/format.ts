/** Event dates are stored as calendar dates (UTC midnight); always format in UTC to avoid off-by-one. */
export function formatDate(d: Date | string, locale = "en-GB"): string {
  return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatTime(t?: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ap}`;
}

export function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}
