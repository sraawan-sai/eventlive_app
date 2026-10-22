"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PLAN_IDS } from "@/lib/plan-limits";
import { requireAdmin } from "@/lib/session";

/** Admin only: set a user's package by hand (until online payments exist). */
export async function setUserPackageAction(userId: string, formData: FormData) {
  await requireAdmin();
  const packageId = String(formData.get("packageId") ?? "");
  if (!PLAN_IDS.includes(packageId)) return;
  await db.user.update({ where: { id: userId }, data: { packageId } });
  revalidatePath("/admin");
  revalidatePath(`/admin/users/${userId}`);
}
