"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteUserAccount } from "@/lib/account";
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

/** Admin only: permanently delete another user and everything they own. Admins cannot delete themselves here. */
export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) return;
  await deleteUserAccount(userId);
  revalidatePath("/admin");
  redirect("/admin");
}
