import type { Metadata } from "next";
import { positioningStatement } from "@/lib/compliance";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Open an Account",
  description:
    "Start an Ashford & Crane application — jurisdiction check, identity, tax self-certification, and documents.",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Open an Account</h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        {positioningStatement()}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        This demo walks the application flow end to end. Uploading documents
        never approves an application by itself — a completed human review is
        always required.
      </p>
      <div className="mt-10">
        <OnboardingWizard />
      </div>
    </div>
  );
}
