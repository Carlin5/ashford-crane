import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { PENDING } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "International Payments",
  description:
    "Cross-border transfers with fees, rates, and recipient amounts disclosed before confirmation.",
};

const features = [
  {
    title: "Bank transfers",
    body: "Domestic and cross-border transfers from your accounts, delivered through regulated payment partners.",
  },
  {
    title: "International transfers",
    body: "Ten clear steps from source account to submission: beneficiary, currency, amount, rate, fees, recipient amount, review, authentication, submit.",
  },
  {
    title: "Beneficiary management",
    body: "Save the people and companies you pay regularly, with details verified each time before release.",
  },
  {
    title: "Transfer scheduling",
    body: "Schedule a transfer for a future date rather than immediate submission — set at the amount or review step.",
  },
  {
    title: "FX quotations",
    body: "Each quote names the reference-rate source and the spread applied, valid for a stated window.",
  },
  {
    title: "Transfer tracking",
    body: "Statuses — Draft, Pending verification, Processing, Completed, Failed, Rejected, Cancelled — tracked end to end and never moved backwards.",
  },
  {
    title: "Payment confirmations",
    body: "A transfer is marked Completed only when the underlying payment system has actually confirmed completion — not before.",
  },
];

export default function InternationalPaymentsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          International Payments
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Move money across borders with the cost of doing so shown up front:
          the rate, the fee, and exactly what the recipient receives — all
          re-confirmed before you approve.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[var(--radius-card)] border border-platinum-200 p-6 dark:border-navy-700"
            >
              <h2 className="text-base font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SectionBlock title="A note on payment rails" className="pt-0">
        <p>
          International payments are delivered through regulated partner
          providers behind the platform&apos;s adapter layer. Payment-rail
          access and correspondent relationships: {PENDING}. We do not claim
          direct SWIFT membership, a BIC, or
          correspondent-banking access; those details will be published once
          they genuinely exist.
        </p>
      </SectionBlock>
    </>
  );
}
