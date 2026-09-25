import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal",
  description: "Legal documents and regulatory information for Ashford & Crane.",
};

const docs = [
  { href: "/legal/privacy", title: "Privacy Policy", desc: "What we collect, why, and your rights over your data." },
  { href: "/legal/terms", title: "Terms of Service", desc: "The terms governing use of the platform." },
  { href: "/legal/cookies", title: "Cookie Policy", desc: "Which cookies we use and how to control them." },
  { href: "/legal/complaints", title: "Complaints", desc: "How to raise a complaint and how we handle it." },
  { href: "/legal/regulatory", title: "Regulatory Information", desc: "Our regulatory status and positioning, stated plainly." },
  { href: "/legal/aml-kyc", title: "AML/KYC Information", desc: "How identity verification, screening, and monitoring work." },
  { href: "/legal/jurisdictions", title: "Jurisdiction Availability", desc: "Where services are available, updated as confirmed." },
];

export default function LegalHubPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">Legal</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Every legal document in one place. Where a required fact is not yet
        confirmed, the document says so explicitly.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="rounded-[var(--radius-card)] border border-platinum-200 p-6 transition-colors hover:bg-platinum-100/60 dark:border-navy-700 dark:hover:bg-navy-900/40"
          >
            <h2 className="text-base font-semibold">{d.title}</h2>
            <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
              {d.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
