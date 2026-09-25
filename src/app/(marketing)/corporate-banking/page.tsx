import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Corporate Banking",
  description:
    "Business accounts, employee cards, approvals workflows, and accounting exports for companies operating across borders.",
};

const features = [
  {
    title: "Business accounts",
    body: "Multi-currency business accounts in USD, EUR, GBP, UGX, KES, and AED.",
  },
  {
    title: "Corporate & employee cards",
    body: "Cards for the team with per-card spending limits, merchant controls, and real-time notifications — issued through a regulated issuer once confirmed.",
  },
  {
    title: "International payments",
    body: "Cross-border supplier and payroll payments with fees and recipient amounts disclosed before approval.",
  },
  {
    title: "Payment approvals",
    body: "Dual-control approvals: transfers above your configured rules require a second authorized user.",
  },
  {
    title: "Multi-user access",
    body: "Role-scoped access for directors, finance staff, and preparers — each sees only what their role permits.",
  },
  {
    title: "Expense management",
    body: "Card spend categorized and exportable, with limits enforced at the card rather than by policy memo.",
  },
  {
    title: "Transaction monitoring",
    body: "A clear activity record across accounts and cards, with alerts routed for review where warranted.",
  },
  {
    title: "Statements & accounting exports",
    body: "Monthly statements and CSV exports that reconcile cleanly into your accounting system.",
  },
];

export default function CorporateBankingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          Corporate Banking
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Accounts, cards, payments, and controls for companies that earn,
          spend, and pay across borders — with separation of duties built in.
        </p>
        <ButtonLink href="/contact" className="mt-8" variant="secondary">
          Talk to Corporate Services
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

      <SectionBlock title="How approvals work" className="pt-0">
        <p>
          A transfer prepared by one user stays in draft until a second
          authorized user approves it — the interface shows &quot;1 of 2
          authorizations&quot; until complete. Approval rules are configured
          per account during onboarding and can be changed by an administrator
          on your side.
        </p>
      </SectionBlock>
    </>
  );
}
