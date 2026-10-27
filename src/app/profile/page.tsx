import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { limitsFor } from "@/lib/plan-limits";
import { SiteHeader } from "@/components/site-header";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "@/components/profile-forms";

export const metadata = { title: "Profile — Eventra", robots: { index: false } };

export default async function ProfilePage() {
  const user = await requireUser();
  const me = await db.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, passwordHash: true, packageId: true, createdAt: true },
  });
  if (!me) notFound();
  const hasPassword = !!me.passwordHash;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 space-y-6 px-4 py-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Your profile</h1>
          <p className="text-foreground/60">
            {limitsFor(me.packageId).name} package · {hasPassword ? "Email + password" : "Google sign-in"} · joined{" "}
            {me.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" })}
          </p>
        </div>
        <ProfileForm name={me.name} email={me.email} />
        {hasPassword && <PasswordForm />}
        <DeleteAccountForm hasPassword={hasPassword} />
      </main>
    </>
  );
}
