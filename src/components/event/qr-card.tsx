"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import { Button, Card } from "@/components/ui";

const noop = () => () => {};

/** Printable QR code that opens the public event page. Generated in the browser; nothing is stored. */
export function QrCard({ slug, name }: { slug: string; name: string }) {
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  const url = origin ? `${origin}/event/${slug}` : "";
  const [png, setPng] = useState<string>();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M" }).then((d) => {
      if (!cancelled) setPng(d);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const file = `${slug}-qr`;

  async function downloadSvg() {
    const svg = await QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = `${file}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <Card>
      <h2 className="font-semibold">QR code</h2>
      <p className="text-xs text-foreground/60">Print it on invitations, banners or posters. Scanning opens your event website.</p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="grid size-48 shrink-0 place-items-center rounded-xl bg-white p-2 ring-1 ring-black/10">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt={`QR code for ${name}`} className="size-full" />
          ) : (
            <span className="text-xs text-foreground/50">Generating…</span>
          )}
        </div>
        <div className="space-y-3 text-center sm:text-left">
          <p className="break-all font-mono text-xs text-foreground/70">{url}</p>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {png && (
              <a href={png} download={`${file}.png`} className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                Download PNG
              </a>
            )}
            <Button variant="secondary" onClick={() => void downloadSvg()} disabled={!url}>
              Download SVG
            </Button>
          </div>
          <p className="text-xs text-foreground/50">PNG is for sharing. SVG stays sharp at any print size.</p>
        </div>
      </div>
    </Card>
  );
}
