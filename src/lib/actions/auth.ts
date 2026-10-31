"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validators";
import { clientIp, loginBlocked, recordRegister, registerBlocked } from "@/lib/rate-limit";

const TOO_MANY = "Too many attempts. Please wait 15 minutes and try again.";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const { name, email, password } = parsed.data;

  const ip = clientIp(await headers());
  if (await registerBlocked(ip)) return { error: "Too many sign-ups from this network. Please try again later." };
  await recordRegister(ip);

  const existing = await db.user.findUnique({ where: { email }, select: { passwordHash: true } });
  if (existing) {
    return {
      error: existing.passwordHash
        ? "An account with this email already exists."
        : "This email is registered with Google. Use “Continue with Google”.",
    };
  }
  await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };
  if (await loginBlocked(parsed.data.email, clientIp(await headers()))) return { error: TOO_MANY };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Incorrect email or password." };
    throw e; // redirect
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
