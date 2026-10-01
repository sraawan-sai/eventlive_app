export function StatusBadge({ status }: { status: string }) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
        <span className="live-dot">🔴</span> LIVE
      </span>
    );
  }
  const map: Record<string, string> = {
    DRAFT: "bg-neutral-200 text-neutral-700",
    PUBLISHED: "bg-emerald-100 text-emerald-800",
    ENDED: "bg-slate-200 text-slate-700",
  };
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? map.DRAFT}`}>{label}</span>;
}
