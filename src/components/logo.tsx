import Link from "next/link";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <rect x="1.5" y="5" width="14" height="14" rx="3.5" fill="var(--brand)" />
      <path d="M16.5 10.2 22 7v10l-5.5-3.2z" fill="var(--brand)" />
      <circle cx="8.5" cy="12" r="2.2" fill="#fff" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-serif text-xl font-bold ${className}`}>
      <LogoMark />
      EventLive
    </Link>
  );
}
