import { OG_SIZE, renderEventOg } from "@/lib/og";

export const alt = "Event invitation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderEventOg(slug);
}
