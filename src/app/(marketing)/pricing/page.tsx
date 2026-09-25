import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/PricingTable";
import { TIERS, ELIGIBILITY_COPY } from "@/../config/tiers";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Every fee category, published in advance — re-confirmed before you approve any transaction.",
};

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          Pricing &amp; Fee Transparency
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          All fees live in configuration, are published here in advance, and —
          most importantly — every fee, exchange rate, and recipient amount is
          re-confirmed before you approve any transaction. Never disclosed
          only after the fact.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <PricingTable />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl font-medium">Client tiers</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className="rounded-[var(--radius-card)] border border-platinum-200 p-6 dark:border-navy-700"
            >
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
                {tier.designedFor}
              </p>
              <ul className="mt-4 list-disc space-y-1.5 ps-5 text-sm text-charcoal-500 dark:text-platinum-200">
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-charcoal-500 dark:text-platinum-200">
                {ELIGIBILITY_COPY}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
