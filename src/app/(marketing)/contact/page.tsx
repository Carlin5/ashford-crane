import type { Metadata } from "next";
import { CONTACT_CHANNELS } from "@/../config/contacts";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Ashford & Crane through the right channel — general, private banking, corporate, compliance, support, or partnerships.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">Contact</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Six separately routed channels so your message reaches the right team.
        We will never ask for your password, authentication codes, or full card
        security code through any contact channel.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_CHANNELS.map((c) => (
          <div
            key={c.id}
            className="rounded-[var(--radius-card)] border border-platinum-200 p-6 dark:border-navy-700"
          >
            <h2 className="text-base font-semibold">{c.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              {c.description}
            </p>
            <p className="mt-4 text-sm font-medium text-midnight-600 dark:text-champagne-500">
              {c.email}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-12 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Physical and regulatory-office addresses are published once confirmed;
        they are not listed here until they are real.
      </p>
    </section>
  );
}
