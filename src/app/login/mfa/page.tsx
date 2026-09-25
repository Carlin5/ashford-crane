import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { MfaForm } from "./MfaForm";

export const metadata: Metadata = {
  title: "Verify Sign-in",
  description: "Enter your authentication code.",
};

export default async function MfaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const { next } = await searchParams;
  if (!session.userId || session.mfa !== "pending") redirect("/login");
  return (
    <div className="flex min-h-screen flex-col bg-platinum-100/60 dark:bg-navy-900">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <h1 className="font-display text-3xl font-medium">
          Verify it&apos;s you
        </h1>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
          Enter the six-digit authentication code. In this demo environment the
          code is always <code className="tnum">000000</code>.
        </p>
        <MfaForm next={next} role={session.role ?? "client"} />
      </div>
    </div>
  );
}
