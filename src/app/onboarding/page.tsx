import type { Metadata } from "next";
import Link from "next/link";
import { positioningStatement, PENDING } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Open an Account",
  description:
    "Start an Ashford & Crane application — identity, residence, and jurisdiction checks.",
};

/**
 * Onboarding entry point. The full KYC/KYB application wizard arrives with
 * the onboarding phase; this page sets expectations and runs the early
 * jurisdiction check concept.
 */
export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Open an Account</h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        {positioningStatement()}
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        <p>
          The application asks for identity, residence, tax residency (CRS/
          FATCA self-certification), and source of funds and wealth. Business
          applicants additionally provide registration details, directors, and
          beneficial owners.
        </p>
        <p>
          An early jurisdiction check confirms whether we can serve your
          country before you invest time in the full application. Jurisdiction
          availability:{" "}
          <Link
            href="/legal/jurisdictions"
            className="text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
          >
            see current status
          </Link>
          .
        </p>
        <p>
          Application review is completed by a human reviewer — uploading
          documents never approves an application automatically. The full
          application wizard is enabled in the next phase of this demo.
          Onboarding availability in your region: {PENDING}.
        </p>
      </div>
      <Link
        href="/contact"
        className="mt-10 inline-block rounded-lg bg-champagne-500 px-5 py-2.5 text-sm font-medium text-navy-900"
      >
        Contact us to begin
      </Link>
    </div>
  );
}
