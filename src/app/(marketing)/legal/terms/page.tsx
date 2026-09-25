import type { Metadata } from "next";
import { PLACEHOLDER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Ashford & Crane platform.",
};

const sections = [
  {
    title: "Eligibility and permitted use",
    body: "The platform is offered to individuals and organizations that complete onboarding and are approved. Eligibility is assessed individually; services may not be available in every jurisdiction.",
  },
  {
    title: "Fees and how they change",
    body: "The fee schedule is published on the Pricing page. Changes are communicated in advance through the platform; every fee is re-confirmed before you approve a transaction.",
  },
  {
    title: "Liability and limitation of liability",
    body: `To be completed with legal counsel. ${PLACEHOLDER}`,
  },
  {
    title: "Indemnification",
    body: `To be completed with legal counsel. ${PLACEHOLDER}`,
  },
  {
    title: "Suspension and termination",
    body: "We may suspend or restrict access where required by law, by our regulated partners, or to protect the platform and its clients. You may close your relationship subject to record-retention obligations.",
  },
  {
    title: "Dispute resolution",
    body: `The dispute-resolution mechanism, including any arbitration clause, is confirmed by legal counsel before publication. ${PLACEHOLDER}`,
  },
  {
    title: "Governing law and jurisdiction",
    body: `${PLACEHOLDER} — confirmed once the operating entity and jurisdictions are finalized. Where translations of these terms exist, the governing-language clause will name which version controls.`,
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Terms of Service</h1>
      <p className="mt-4 text-sm text-charcoal-500 dark:text-platinum-200">
        Version and effective date: {PLACEHOLDER}. This document contains the
        required sections; marked fields are completed with legal counsel
        before launch.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl font-medium">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
