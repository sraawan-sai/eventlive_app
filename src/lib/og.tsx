import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { EVENT_TYPE_CONFIG, type EventType } from "@/lib/event-types";
import { formatDate } from "@/lib/format";
import { getTemplate } from "@/lib/templates";

export const OG_SIZE = { width: 1200, height: 630 };

/** Fetch a JPEG/PNG cover and inline it (the renderer cannot load SVG/WebP). Returns null on any problem. */
async function loadCover(url: string | null): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    const type = r.headers.get("content-type")?.split(";")[0] ?? "";
    if (!r.ok || !["image/jpeg", "image/png"].includes(type)) return null;
    const buf = await r.arrayBuffer();
    if (buf.byteLength > 4 * 1024 * 1024) return null;
    return `data:${type};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderEventOg(slug: string) {
  const e = await db.event.findUnique({
    where: { slug },
    select: {
      name: true, type: true, hostOne: true, hostTwo: true, eventDate: true,
      venueName: true, coverImageUrl: true, template: true, status: true,
    },
  });

  const visible = e && e.status !== "DRAFT";
  const theme = getTemplate(visible ? e.template : "elegant");
  const [bg, accent, soft] = [theme.swatch[1], theme.swatch[2], theme.swatch[0]];
  const cfg = EVENT_TYPE_CONFIG[(e?.type as EventType) ?? "OTHER"] ?? EVENT_TYPE_CONFIG.OTHER;
  const headline = visible ? cfg.headline(e.hostOne ?? "", e.hostTwo ?? "", e.name).replace("❤️", "&") : "Eventra";
  const cover = visible ? await loadCover(e.coverImageUrl) : null;
  const dark = theme.id === "minimal" ? false : true;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative",
          background: `linear-gradient(135deg, ${bg}, ${accent})`,
          fontFamily: "sans-serif",
        }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)" }} />
        <div
          style={{
            position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            width: "100%", height: "100%", padding: 60, textAlign: "center",
            color: dark ? "#ffffff" : "#171717",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: dark ? soft : "#525252" }}>
            {visible ? cfg.tagline : "Event websites"}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: headline.length > 28 ? 68 : 92, fontWeight: 800, lineHeight: 1.1, justifyContent: "center" }}>
            {headline}
          </div>
          {visible && (
            <div style={{ display: "flex", marginTop: 32, fontSize: 38 }}>
              {formatDate(e.eventDate)}
              {e.venueName ? `  ·  ${e.venueName}` : ""}
            </div>
          )}
          <div style={{ display: "flex", marginTop: 44, padding: "14px 34px", borderRadius: 999, background: "#d6284b", color: "#fff", fontSize: 30, fontWeight: 700 }}>
            Watch live on Eventra
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
