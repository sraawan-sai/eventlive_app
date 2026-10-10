import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Server-side guard: returns the signed-in user or redirects to /login. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

/** Admin emails come from the ADMIN_EMAILS env var (comma separated). Never trust anything from the browser. */
export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

/** Admin pages return 404 to everyone else so their existence is not revealed. */
export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) notFound();
  return user;
}
