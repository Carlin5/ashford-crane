import type { Metadata } from "next";
import { Hero3D } from "@/components/marketing/Hero3D";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Private Banking, Designed Around You",
  description:
    "Ashford & Crane is a private-banking technology platform for clients who hold, move, and grow money across currencies and borders.",
};

const currencies = ["USD", "EUR", "GBP", "UGX", "KES", "AED"];

export default function HomePage() {
  return (
    <>
      {/* The single bold moment: hero with the restrained 3D object. */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <h1 className="font-display text-5xl font-medium leading-tight md:text-6xl">
              Private Banking, Designed Around You.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-platinum-200">
              One trusted place to hold, move, and grow money across currencies
              and borders — built on real regulated infrastructure, not
              marketing claims.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/onboarding">Open an Account</ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="border-platinum-200/40 text-white hover:bg-navy-700"
              >
                Speak With a Private Banker
              </ButtonLink>
            </div>
          </div>
          <Hero3D className="relative h-72 w-full md:h-[26rem]" />
        </div>
      </section>

      <SectionBlock
        title="Private Banking"
        href="/private-banking"
        linkLabel="Explore private banking"
      >
        <p>
          Personal accounts with dedicated relationship-manager access, tiered
          service, and discreet handling by default. Regulated banking services
          are delivered by named partner institutions once confirmed; Ashford
          &amp; Crane provides the technology and client-experience layer.
        </p>
      </SectionBlock>

      <SectionBlock
        title="International Payments"
        href="/international-payments"
        linkLabel="How transfers work"
        tinted
      >
        <p>
          Cross-border transfers with every fee, exchange rate, and recipient
          amount disclosed and re-confirmed before you approve — never after.
          Transfer status is tracked end to end inside the platform.
        </p>
      </SectionBlock>

      {/* The one scroll reveal on this page: the multi-currency block. */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl font-medium md:text-4xl">
            Multi-Currency Accounts
          </h2>
          <p className="mt-6 max-w-3xl text-charcoal-500 dark:text-platinum-200">
            Hold and manage balances across six currencies from a single
            relationship, with figures displayed in the precision each currency
            actually uses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {currencies.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-platinum-200 px-4 py-2 text-sm font-medium tnum dark:border-navy-700"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <SectionBlock
        title="Corporate Services"
        href="/corporate-banking"
        linkLabel="Corporate banking"
        tinted
      >
        <p>
          Business accounts, employee cards with spending controls, multi-user
          access, and approval workflows so no single person moves company
          funds alone.
        </p>
      </SectionBlock>

      <SectionBlock
        title="Wealth Management"
        href="/wealth-management"
        linkLabel="Wealth reporting"
      >
        <p>
          Consolidated, read-only reporting across accounts and custodied
          assets. Ashford &amp; Crane is the reporting layer — advice and
          execution stay with licensed partners, clearly disclosed.
        </p>
      </SectionBlock>

      <SectionBlock
        title="Cards & Payments"
        href="/cards"
        linkLabel="See the cards"
        tinted
      >
        <p>
          The Ashford Private Card and Ashford Corporate Card, issued through a
          regulated card issuer once confirmed — with freeze, limits, and
          geographic controls you manage yourself.
        </p>
      </SectionBlock>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <Card elevated className="p-8">
            <h2 className="font-display text-2xl font-medium">
              Security &amp; Compliance
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              Encryption in transit and at rest, multi-factor authentication,
              session and device management, and an append-only audit trail.
              Our Trust Center explains each control in plain language.
            </p>
            <ButtonLink
              href="/security"
              variant="ghost"
              className="mt-6 px-0"
            >
              Visit the Trust Center
            </ButtonLink>
          </Card>
          <Card className="p-8">
            <h2 className="font-display text-2xl font-medium">
              Transparent Pricing
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              Every fee category is published in advance, and every fee, rate,
              and recipient amount is re-confirmed before you approve a
              transaction.
            </p>
            <ButtonLink href="/pricing" variant="ghost" className="mt-6 px-0">
              View pricing
            </ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
