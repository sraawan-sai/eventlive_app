import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loginAction, googleSignInAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Log in — EventLive" };

export default async function LoginPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return (
    <>
      <AuthForm mode="login" action={loginAction} googleAction={process.env.AUTH_GOOGLE_ID ? googleSignInAction : undefined} />
    </>
  );
}
