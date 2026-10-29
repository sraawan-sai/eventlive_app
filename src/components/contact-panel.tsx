import QRCode from "qrcode";
import { Card } from "@/components/ui";

/** `NEXT_PUBLIC_INSTAGRAM` may be a handle ("eventra.live", "@eventra.live") or a full profile link. */
function instagramHandle(raw?: string) {
  const last = raw?.trim().split("?")[0].replace(/\/+$/, "").split("/").pop() ?? "";
  const handle = last.replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? handle : "";
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-1-2z" />
    </svg>
  );
}

/** WhatsApp QR code (payments) and Instagram link (queries). Reads NEXT_PUBLIC_CONTACT_WHATSAPP and NEXT_PUBLIC_INSTAGRAM; shows nothing if neither is set. */
export async function ContactPanel({
  message = "Hi, I have a question about payment for an Eventra package.",
  title = "Payments and questions",
  subtitle = "Reach us on WhatsApp for payments and on Instagram for any other query.",
}: {
  /** First WhatsApp message, already typed when the chat opens. */
  message?: string;
  title?: string;
  subtitle?: string;
} = {}) {
  const wa = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.replace(/\D/g, "");
  const ig = instagramHandle(process.env.NEXT_PUBLIC_INSTAGRAM);
  if (!wa && !ig) return null;

  const waLink = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(message)}` : "";
  const qr = waLink ? await QRCode.toDataURL(waLink, { width: 480, margin: 1, errorCorrectionLevel: "M" }) : "";

  return (
    <Card className="w-full max-w-md p-7 text-center">
      <h2 className="font-serif text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>

      {wa && (
        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="WhatsApp QR code" width={176} height={176} className="mx-auto size-44 rounded-2xl bg-white p-2 ring-1 ring-black/10" />
          <p className="mt-3 text-sm font-semibold">Payments: scan to chat on WhatsApp</p>
          <p className="text-sm text-foreground/60">+{wa}</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            <WhatsAppGlyph /> Open WhatsApp
          </a>
        </div>
      )}

      {ig && (
        <div className={wa ? "mt-6 border-t border-black/5 pt-6" : "mt-6"}>
          <p className="text-sm text-foreground/60">Queries: message our Instagram page</p>
          <a
            href={`https://instagram.com/${ig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            <InstagramGlyph /> @{ig}
          </a>
        </div>
      )}
    </Card>
  );
}
