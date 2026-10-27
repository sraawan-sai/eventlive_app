"use client";

import { useActionState } from "react";
import { changePasswordAction, deleteAccountAction, updateProfileAction, type AccountState } from "@/lib/actions/account";
import { Button, Card, Field, inputCls } from "@/components/ui";

function Message({ state }: { state: AccountState }) {
  if (state.error) return <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.ok}</p>;
  return null;
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  return (
    <Card>
      <h2 className="text-lg font-semibold">Profile</h2>
      <form action={action} className="mt-4 space-y-4">
        <Field label="Your name">
          <input name="name" defaultValue={name} required autoComplete="name" className={inputCls} />
        </Field>
        <Field label="Email" hint="Your email can't be changed.">
          <input value={email} readOnly disabled className={`${inputCls} bg-black/[0.03]`} />
        </Field>
        <Message state={state} />
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  return (
    <Card>
      <h2 className="text-lg font-semibold">Change password</h2>
      <form action={action} className="mt-4 space-y-4">
        <Field label="Current password">
          <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
        </Field>
        <Field label="New password" hint="At least 8 characters">
          <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
        </Field>
        <Message state={state} />
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Change password"}</Button>
      </form>
    </Card>
  );
}

export function DeleteAccountForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState(deleteAccountAction, {});
  return (
    <Card className="ring-red-200">
      <h2 className="text-lg font-semibold text-red-700">Delete account</h2>
      <p className="mt-1 text-sm text-foreground/70">
        This permanently deletes your account, all your events, photos, videos and sponsors. It cannot be undone.
      </p>
      <form
        action={action}
        onSubmit={(e) => {
          if (!window.confirm("Delete your account and everything in it? This cannot be undone.")) e.preventDefault();
        }}
        className="mt-4 space-y-4"
      >
        {hasPassword && (
          <Field label="Your password">
            <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </Field>
        )}
        <Field label="Type DELETE to confirm">
          <input name="confirm" required autoComplete="off" placeholder="DELETE" className={inputCls} />
        </Field>
        <Message state={state} />
        <Button type="submit" variant="danger" disabled={pending}>{pending ? "Deleting…" : "Delete my account"}</Button>
      </form>
    </Card>
  );
}
