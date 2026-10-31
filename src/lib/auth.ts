import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { clientIp, loginBlocked, recordLoginFailure } from "@/lib/rate-limit";

/** Compared against when the account does not exist, so a missing account takes as long to reject as a wrong password. */
const DUMMY_HASH = "$2b$12$VtoyDGHat33pxzUAcDBubexKkaie40htOWk01sfgT8ArcXxHs3SNq";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Sign-ins last a week, then the person signs in again.
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    // Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET from the environment.
    ...(process.env.AUTH_GOOGLE_ID ? [Google] : []),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        // This is the one place every password sign-in passes through (the form and a direct call to the auth route).
        const ip = clientIp(request.headers);
        if (await loginBlocked(email, ip)) return null;
        const user = await db.user.findUnique({ where: { email } });
        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH); // Google-only accounts have no password
        if (!user?.passwordHash || !ok) {
          await recordLoginFailure(email, ip);
          return null;
        }
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      // Only trust Google emails Google itself has verified (prevents account takeover by email).
      return profile?.email_verified === true && !!profile.email;
    },
    async jwt({ token, user, account, profile }) {
      // `account` is only set on the request that actually signs the user in.
      const signedIn = !!account;
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email.toLowerCase();
        const dbUser = await db.user.upsert({
          where: { email },
          update: {},
          create: { email, name: profile.name ?? email.split("@")[0], passwordHash: null },
          select: { id: true },
        });
        token.uid = dbUser.id;
      } else if (user?.id) {
        token.uid = user.id;
      }
      if (signedIn) token.provider = account?.provider === "google" ? "google" : "password";
      if (signedIn && token.uid) await recordLogin(token.uid as string, account?.provider === "google" ? "google" : "password");
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      if (token.provider) session.user.provider = token.provider as string;
      return session;
    },
  },
});

/** Best effort: a logging failure must never block a sign-in. */
async function recordLogin(userId: string, method: "google" | "password") {
  try {
    const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
    await db.$transaction([
      db.loginEvent.create({ data: { userId, method, userAgent: ua } }),
      db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date(), loginCount: { increment: 1 } } }),
    ]);
  } catch {
    /* ignore */
  }
}
