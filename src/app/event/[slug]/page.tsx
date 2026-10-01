import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSiteEventBySlug } from "@/lib/events-query";
import { EventSite } from "@/components/event/event-site";

type Props = PageProps<"/event/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteEventBySlug(slug);
  if (!data || data.record.status === "DRAFT") return { title: "Event not found" };
  const { name, hostOne, hostTwo, description } = data.record;
  const title = `${name} | Live`;
  const desc =
    description?.slice(0, 160) ??
    (hostOne && hostTwo
      ? `Join us and watch ${hostOne} & ${hostTwo}'s celebration live.`
      : `Join us and watch ${name} live.`);
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "website", url: `/event/${slug}`, images: data.record.coverImageUrl ? [data.record.coverImageUrl] : [] },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function PublicEventPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSiteEventBySlug(slug);
  if (!data) notFound();

  if (data.record.status === "DRAFT") {
    const session = await auth();
    if (session?.user?.id !== data.record.userId) notFound();
  }
  return <EventSite event={data.site} />;
}
