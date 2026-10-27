import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { limitsFor } from "@/lib/plan-limits";
import { SiteHeader } from "@/components/site-header";
import { AccountSidebar } from "@/components/account-sidebar";
import { DeleteAccountForm, PasswordForm, ProfileForm } from "@/components/profile-forms";

export const metadata = { title: "Profile & Settings — Eventra", robots: { index: false } };

export default async function ProfilePage() {
  const user = await requireUser();
  const me = await db.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, passwordHash: true, packageId: true },
  });
  if (!me) notFound();
  const hasPassword = !!me.passwordHash;

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 bg-slate-50">
        <AccountSidebar active="/profile" />
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 lg:mx-0 lg:px-10">
          <div>
            <h1 className="font-serif text-3xl font-bold">Profile &amp; Settings</h1>
            <p className="text-foreground/60">Manage your account details and preferences</p>
          </div>
          <ProfileForm name={me.name} email={me.email} packageName={limitsFor(me.packageId).name} />
          {hasPassword && <PasswordForm />}
          <DeleteAccountForm hasPassword={hasPassword} />
        </main>
      </div>
    </>
  );
}
