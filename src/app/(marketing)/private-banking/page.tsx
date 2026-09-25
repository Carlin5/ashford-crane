import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Private Banking",
  description:
    "Personal multi-currency accounts, international transfers, wealth-reporting technology, and relationship-manager support.",
};

const features = [
  {
    title: "Personal accounts",
    body: "Individual accounts held in the currency or currencies you actually use, with available and ledger balances shown separately and statements on demand.",
  },
  {
    title: "Multi-currency accounts",
    body: "USD, EUR, GBP, UGX, KES, and AED from a single relationship, each displayed in its own precision.",
  },
  {
    title: "International transfers",
    body: "Cross-border transfers with the rate, fee, and recipient amount re-confirmed before you approve.",
  },
  {
    title: "Wealth-management technology",
    body: "Consolidated reporting across your accounts and consented external holdings — the reporting layer, not investment advice.",
  },
  {
    title: "Relationship-manager support",
    body: "A named relationship manager at Private Plus and above; digital-first support at every tier.",
  },
  {
    title: "Corporate banking solutions",
    body: "Where your personal and business finances intersect, corporate accounts sit alongside under the same sign-in discipline.",
  },
  {
    title: "Financial reporting",
    body: "Statements, CSV exports, and transaction detail designed for your records and your accountant.",
  },
  {
    title: "Payment cards",
    body: "Cards issued through a regulated card issuer once confirmed, with controls you manage yourself.",
  },
];

export default function PrivateBankingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          Private Banking
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Personal accounts, multi-currency holdings, international transfers,
          and relationship-manager support — delivered through one secure
          platform, on top of regulated partner infrastructure.
        </p>
        <ButtonLink href="/onboarding" className="mt-8">
          Open an Account
        </ButtonLink>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <SectionBlock title="Eligibility" className="pt-0">
        <p>
          Private Banking services are offered across four tiers — Private,
          Private Plus, Corporate, and Institutional. Eligibility assessed
          individually; jurisdiction availability is published in our legal
          section as it is confirmed.
        </p>
      </SectionBlock>
    </>
  );
}
