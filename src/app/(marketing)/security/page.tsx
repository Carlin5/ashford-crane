import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";

export const metadata: Metadata = {
  title: "Security & Trust Center",
  description:
    "How Ashford & Crane protects your accounts and data — explained in plain language.",
};

const controls = [
  {
    title: "Encryption everywhere",
    body: "Your data is encrypted in transit between your device and our servers, and at rest in our systems.",
  },
  {
    title: "Multi-factor authentication",
    body: "Signing in and authorizing transfers requires a second factor. Passkeys are available where your device supports them.",
  },
  {
    title: "Device and session management",
    body: "See every signed-in session and device, get notified about new ones, and sign them out remotely.",
  },
  {
    title: "Transaction authentication",
    body: "Moving money requires explicit authentication at the moment you approve — not just being signed in.",
  },
  {
    title: "Strict internal access",
    body: "Staff roles are narrowly scoped: support sees masked details, and no single staff member can move client funds alone — two distinct authorizers are required.",
  },
  {
    title: "Complete audit trail",
    body: "Every sensitive action, by clients and staff alike, is written to an append-only audit log that cannot be edited after the fact.",
  },
  {
    title: "Tokenized card data",
    body: "Raw card numbers and security codes never touch our servers; card data is held in tokenized form through the regulated issuer.",
  },
  {
    title: "Independent testing",
    body: "We commit to independent penetration testing at least annually and after major architecture changes, and to SOC 2 Type II and ISO 27001 as roadmap milestones — these are targets, not certifications we already claim.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          Security &amp; Trust Center
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          What we do to protect your money and your data, in plain language.
          Where a certification or control is still on the roadmap, we label
          it as a target rather than claim it.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {controls.map((c) => (
            <div
              key={c.title}
              className="rounded-[var(--radius-card)] border border-platinum-200 p-6 dark:border-navy-700"
            >
              <h2 className="text-base font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SectionBlock title="If something looks wrong" className="pt-0">
        <p>
          Freeze a card instantly from the app, sign out sessions you
          don&apos;t recognize, and contact Technical Support through the
          secure channel on our Contact page. We will never ask for your
          password, full card security code, or authentication codes through
          chat or email.
        </p>
        <p>
          Security researchers: a vulnerability-disclosure channel is listed
          on the Contact page under Technical Support.
        </p>
      </SectionBlock>
    </>
  );
}
