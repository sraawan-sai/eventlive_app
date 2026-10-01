import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteObjects } from "@/lib/storage";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/media/[mediaId]">) {
  const { mediaId } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const media = await db.eventMedia.findUnique({ where: { id: mediaId }, include: { event: { select: { userId: true } } } });
  if (!media) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (media.event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  await db.eventMedia.delete({ where: { id: mediaId } });
  await deleteObjects([media.key]);
  return NextResponse.json({ ok: true });
}
