import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return <Image src="/brand/logo.png" alt="" width={64} height={64} className={className} priority />;
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Eventra home" className={`inline-flex items-center gap-2 font-serif text-xl font-bold ${className}`}>
      <LogoMark />
      Eventra
    </Link>
  );
}
