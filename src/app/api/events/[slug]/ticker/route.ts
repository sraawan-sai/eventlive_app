import { crossSiteBlocked, forbidden } from "@/lib/request-guard";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bodySchema = z.object({
  on: z.boolean(),
  // plain text only; React escapes it when shown. Control characters are stripped.
  text: z
    .string()
    .max(200)
    .transform((t) => t.replace(/[\u0000-\u001f\u007f]/g, " ").trim()),
});

/** Owner-only: set the scrolling message and switch it on or off. */
export async function PATCH(req: Request, ctx: RouteContext<"/api/events/[slug]/ticker">) {
  if (crossSiteBlocked(req)) return forbidden();
  const { slug } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Message can be up to 200 characters." }, { status: 400 });

  const event = await db.event.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.userId !== session.user.id) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { on, text } = parsed.data;
  if (on && !text) return NextResponse.json({ error: "Type a message before turning it on." }, { status: 400 });

  await db.event.update({ where: { id: event.id }, data: { tickerOn: on, tickerText: text || null } });
  return NextResponse.json({ ok: true, on, text });
}
