"use client";

import { Button } from "@/components/ui";

/** Admin: delete another user. Asks the browser to confirm before submitting. */
export function DeleteUserForm({ action, name }: { action: () => Promise<void>; name: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Permanently delete ${name}, all their events and files? This cannot be undone.`)) e.preventDefault();
      }}
      className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-red-200"
    >
      <Button type="submit" variant="danger">Delete user</Button>
      <span className="text-xs text-foreground/60">Removes the account, every event, and all uploaded files.</span>
    </form>
  );
}
