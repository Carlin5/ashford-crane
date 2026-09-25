import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to your Ashford & Crane account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const { next } = await searchParams;
  if (session.userId && session.mfa === "complete") {
    redirect(session.role === "client" ? (next ?? "/app") : "/admin");
  }
  if (session.mfa === "pending") redirect("/login/mfa");
  return (
    <div className="flex min-h-screen flex-col bg-platinum-100/60 dark:bg-navy-900">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="font-display text-lg font-medium text-charcoal-900 dark:text-white"
        >
          Ashford &amp; Crane
        </Link>
        <h1 className="mt-8 font-display text-3xl font-medium">Client login</h1>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
          Sign in to your account. You&apos;ll confirm with a second factor
          next. In this demo, every seeded user&apos;s password is{" "}
          <code className="tnum">demo-sandbox</code> and the MFA code is{" "}
          <code className="tnum">000000</code>.
        </p>
        <LoginForm next={next} />
        <p className="mt-6 text-xs leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Passkeys are available where your device supports them. We will
          never ask for your password through chat or email.
        </p>
        <Link
          href="/"
          className="mt-8 text-sm text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
        >
          Back to ashfordcrane
        </Link>
      </div>
    </div>
  );
}
