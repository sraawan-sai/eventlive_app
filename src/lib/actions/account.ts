"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { signOut } from "@/lib/auth";
import { deleteUserAccount } from "@/lib/account";
import { requireUser } from "@/lib/session";

export interface AccountState {
  error?: string;
  ok?: string;
}

const nameSchema = z.string().trim().min(2, "Enter your name").max(80);
const newPasswordSchema = z.string().min(8, "New password must be at least 8 characters").max(72);

export async function updateProfileAction(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await requireUser();
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter your name" };
  await db.user.update({ where: { id: user.id }, data: { name: parsed.data } });
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: "Profile saved." };
}

export async function changePasswordAction(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await requireUser();
  const me = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!me?.passwordHash) return { error: "Your account signs in with Google, so it has no password." };

  const next = newPasswordSchema.safeParse(formData.get("newPassword"));
  if (!next.success) return { error: next.error.issues[0]?.message };
  const current = String(formData.get("currentPassword") ?? "");
  if (!(await bcrypt.compare(current, me.passwordHash))) return { error: "Current password is incorrect." };

  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next.data, 12) } });
  return { ok: "Password changed." };
}

/** Self-service delete. Asks for the word DELETE, plus the password for password accounts. */
export async function deleteAccountAction(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await requireUser();
  if (String(formData.get("confirm") ?? "").trim() !== "DELETE") return { error: "Type DELETE to confirm." };

  const me = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!me) return { error: "Account not found." };
  if (me.passwordHash && !(await bcrypt.compare(String(formData.get("password") ?? ""), me.passwordHash))) {
    return { error: "Password is incorrect." };
  }

  await deleteUserAccount(user.id);
  await signOut({ redirectTo: "/" });
  return {};
}
