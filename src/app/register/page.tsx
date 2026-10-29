import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { registerAction, googleSignInAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { ContactPanel } from "@/components/contact-panel";

export const metadata = { title: "Create account — Eventra" };

export default async function RegisterPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return (
    <>
      <AuthForm mode="register" action={registerAction} googleAction={process.env.AUTH_GOOGLE_ID ? googleSignInAction : undefined} aside={<ContactPanel />} />
    </>
  );
}
