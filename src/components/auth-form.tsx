"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/lib/actions/auth";
import { Button, Card, Field, inputCls } from "@/components/ui";
import { Logo } from "@/components/logo";

export function AuthForm({
  mode,
  action,
  googleAction,
}: {
  mode: "login" | "register";
  action: (s: FormState, f: FormData) => Promise<FormState>;
  /** Passed only when Google login is configured. */
  googleAction?: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const fe = state.fieldErrors ?? {};
  const isLogin = mode === "login";
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-md p-7">
        <div className="mb-4 flex justify-center"><Logo /></div>
        <h1 className="text-center font-serif text-2xl font-bold">{isLogin ? "Welcome Back" : "Create your account"}</h1>
        <p className="mt-1 text-center text-sm text-foreground/60">
          {isLogin ? "Sign in to your account" : "Start building your event website."}
        </p>
        {googleAction && (
          <>
            <form action={googleAction} className="mt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-black/[0.03]"
              >
                <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.5 17.6 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.4-4.8 7.1l7.6 5.9c4.4-4.1 7-10.1 7-17.5z"/>
                  <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"/>
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-4-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
                </svg>
                Continue with Google
              </button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs text-foreground/50">
              <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
            </div>
          </>
        )}
        <form action={formAction} className={`${googleAction ? "" : "mt-6 "}space-y-4`}>
          {!isLogin && (
            <Field label="Your name" error={fe.name?.[0]}>
              <input name="name" required autoComplete="name" className={inputCls} />
            </Field>
          )}
          <Field label="Email" error={fe.email?.[0]}>
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
          </Field>
          <Field label="Password" error={fe.password?.[0]} hint={isLogin ? undefined : "At least 8 characters"}>
            <input
              name="password"
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={inputCls}
            />
          </Field>
          {state.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Please wait…" : isLogin ? "Sign In" : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-foreground/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-brand hover:underline">
            {isLogin ? "Create one" : "Sign in"}
          </Link>
        </p>
      </Card>
    </main>
  );
}
