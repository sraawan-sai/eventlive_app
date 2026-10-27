"use client";

import { useActionState, type ComponentProps, type ReactNode } from "react";
import { changePasswordAction, deleteAccountAction, updateProfileAction, type AccountState } from "@/lib/actions/account";
import { Button, Card, Field, inputCls } from "@/components/ui";
import { LockIcon, MailIcon, SaveIcon, TrashIcon, UserIcon } from "@/components/icons";

function Message({ state }: { state: AccountState }) {
  if (state.error) return <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.ok}</p>;
  return null;
}

/** Text input with an icon on the left. */
function IconInput({ icon, className = "", ...p }: ComponentProps<"input"> & { icon: ReactNode }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45">{icon}</span>
      <input className={`${inputCls} pl-11 ${className}`} {...p} />
    </span>
  );
}

function SectionHead({ icon, title, text, tone = "brand" }: { icon: ReactNode; title: string; text: string; tone?: "brand" | "danger" }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone === "danger" ? "bg-red-100 text-red-600" : "bg-tint text-brand"}`}>{icon}</span>
      <div>
        <h2 className={`text-lg font-bold ${tone === "danger" ? "text-red-700" : ""}`}>{title}</h2>
        <p className="text-sm text-foreground/60">{text}</p>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";
}

export function ProfileForm({ name, email, packageName }: { name: string; email: string; packageName: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  return (
    <Card className="p-6">
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3 md:border-r md:border-black/5 md:pr-6">
          <span className="flex size-28 items-center justify-center rounded-full bg-tint text-3xl font-semibold text-brand" aria-hidden="true">
            {initials(name)}
          </span>
          <p className="text-center text-lg font-bold">{name}</p>
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-foreground/70">{packageName} package</span>
        </div>
        <div>
          <SectionHead icon={<UserIcon />} title="Profile Information" text="Update your name and account details" />
          <form action={action} className="mt-5 space-y-4">
            <Field label="Your name">
              <IconInput icon={<UserIcon width={18} height={18} />} name="name" defaultValue={name} required autoComplete="name" />
            </Field>
            <Field label="Email" hint="Your email can't be changed.">
              <IconInput icon={<MailIcon width={18} height={18} />} value={email} readOnly disabled className="bg-black/[0.04]" />
            </Field>
            <Message state={state} />
            <div className="flex justify-end">
              <Button type="submit" disabled={pending}>
                <SaveIcon width={18} height={18} />
                {pending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  return (
    <Card className="p-6">
      <SectionHead icon={<LockIcon />} title="Change password" text="Use at least 8 characters" />
      <form action={action} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <IconInput icon={<LockIcon width={18} height={18} />} name="currentPassword" type="password" required autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <IconInput icon={<LockIcon width={18} height={18} />} name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
          </Field>
        </div>
        <Message state={state} />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            <SaveIcon width={18} height={18} />
            {pending ? "Saving…" : "Change password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState(deleteAccountAction, {});
  return (
    <section className="rounded-2xl bg-red-50/70 p-6 ring-1 ring-red-200">
      <SectionHead
        tone="danger"
        icon={<TrashIcon />}
        title="Delete account"
        text="This permanently deletes your account, all your events, photos, videos and sponsors. It cannot be undone."
      />
      <form
        action={action}
        onSubmit={(e) => {
          if (!window.confirm("Delete your account and everything in it? This cannot be undone.")) e.preventDefault();
        }}
        className="mt-5 space-y-4"
      >
        {hasPassword && (
          <Field label="Your password">
            <IconInput icon={<LockIcon width={18} height={18} />} name="password" type="password" required autoComplete="current-password" />
          </Field>
        )}
        <Field label="Type DELETE to confirm">
          <IconInput icon={<LockIcon width={18} height={18} />} name="confirm" required autoComplete="off" placeholder="DELETE" />
        </Field>
        <Message state={state} />
        <div className="flex justify-end">
          <Button type="submit" variant="danger" disabled={pending}>
            <TrashIcon width={18} height={18} />
            {pending ? "Deleting…" : "Delete my account"}
          </Button>
        </div>
      </form>
    </section>
  );
}
