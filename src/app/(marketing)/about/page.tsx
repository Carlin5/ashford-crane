import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { positioningStatement, PLACEHOLDER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ashford & Crane's mission, private-client philosophy, technology approach, and international service model.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          About Ashford &amp; Crane
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          An international private-banking and wealth-management technology
          platform for individuals, entrepreneurs, companies, and investors
          operating across borders.
        </p>
      </section>

      <SectionBlock title="Our Mission">
        <p>
          To give internationally minded clients one trusted, secure place to
          hold, move, and grow money across currencies and borders — built on
          real regulated infrastructure, not marketing claims.
        </p>
      </SectionBlock>

      <SectionBlock title="Private-Client Philosophy">
        <p>
          Private means discreet by default: dedicated relationship-manager
          access, tiered service, and information shared on a need-to-know
          basis. International means multi-currency accounts, cross-border
          transfers, and multi-jurisdiction eligibility. Secure means the
          controls described in our Trust Center, applied consistently.
          Transparent means every fee, rate, and partner disclosed before
          confirmation — never after.
        </p>
      </SectionBlock>

      <SectionBlock title="Technology Infrastructure">
        <p>
          The platform is built as a technology and client-experience layer
          over regulated partner infrastructure. Banking, custody, card
          issuing, payments, foreign exchange, and screening each sit behind a
          provider adapter, so the regulated service can be delivered — and
          clearly attributed — by the institution actually licensed to provide
          it.
        </p>
      </SectionBlock>

      <SectionBlock title="Compliance Approach">
        <p>
          Compliance is designed in, not added on: structured onboarding,
          sanctions and PEP screening, transaction monitoring, dual control on
          movements of client funds, and an append-only audit trail. Where a
          regulatory fact is not yet confirmed, we say so plainly.
        </p>
      </SectionBlock>

      <SectionBlock title="International Service Model">
        <p>
          The platform supports clients across East Africa, the Gulf, and
          major reserve-currency markets, with accounts in USD, EUR, GBP, UGX,
          KES, and AED, English and Arabic interfaces, and right-to-left
          layout support.
        </p>
      </SectionBlock>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl font-medium">
          Regulatory Positioning
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
          {positioningStatement()}
        </p>
        <dl className="mt-8 grid max-w-3xl gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium">Legal entity name</dt>
            <dd className="text-charcoal-500 dark:text-platinum-200">
              {PLACEHOLDER}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Company number</dt>
            <dd className="text-charcoal-500 dark:text-platinum-200">
              {PLACEHOLDER}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Registered office</dt>
            <dd className="text-charcoal-500 dark:text-platinum-200">
              {PLACEHOLDER}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Regulatory status</dt>
            <dd className="text-charcoal-500 dark:text-platinum-200">
              {PLACEHOLDER}
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
