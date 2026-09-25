import type { Metadata } from "next";
import {
  positioningStatement,
  partnerDisclosure,
  PLACEHOLDER,
} from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Regulatory Information",
  description:
    "Ashford & Crane's regulatory status, stated plainly and updated as facts are confirmed.",
};

const rows = [
  { label: "Legal entity name", value: PLACEHOLDER },
  { label: "Company registration number", value: PLACEHOLDER },
  { label: "Registered office", value: PLACEHOLDER },
  { label: "Banking / EMI license", value: PLACEHOLDER },
  { label: "Regulator", value: PLACEHOLDER },
  { label: "SWIFT membership / BIC", value: PLACEHOLDER },
  { label: "Deposit insurance", value: PLACEHOLDER },
  { label: "Card network membership / issuer", value: PLACEHOLDER },
];

export default function RegulatoryPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">
        Regulatory Information
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        {positioningStatement()}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        {partnerDisclosure({ service: "Regulated services" })}
      </p>
      <dl className="mt-10 divide-y divide-platinum-200/60 dark:divide-navy-700/60">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-2">
            <dt className="text-sm font-medium">{r.label}</dt>
            <dd className="text-sm text-charcoal-500 dark:text-platinum-200">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Ashford &amp; Crane does not claim a banking license, SWIFT
        membership, a BIC, deposit insurance, card-network membership, or
        central-bank authorization. Each field above is filled only once a
        real, verifiable detail exists.
      </p>
    </section>
  );
}
