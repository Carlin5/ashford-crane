import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to your Ashford & Crane account.",
};

/**
 * Sign-in form UI. Authentication (login → MFA → session) is wired up in a
 * later phase; the sandbox MFA code will be 000000.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-platinum-100/60 dark:bg-navy-900">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="font-display text-lg font-medium text-charcoal-900 dark:text-white"
        >
          Ashford &amp; Crane
        </Link>
        <h1 className="mt-8 font-display text-3xl font-medium">
          Client login
        </h1>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
          Sign in to your account. You&apos;ll confirm with a second factor
          next.
        </p>
        <form className="mt-8 flex flex-col gap-5" action="#">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Button type="submit">Sign in</Button>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Passkeys are available where your device supports them. We will
          never ask for your password through chat or email. This is the demo
          environment — authentication is enabled in a later phase.
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
