import type { Metadata } from "next";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Wealth Management",
  description:
    "Net-worth aggregation, portfolio reporting, and routing to licensed partners — technology and reporting, not investment advice.",
};

export default function WealthManagementPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">
          Wealth Management
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Reporting, aggregation, and access technology on top of licensed
          partners. Ashford &amp; Crane does not give investment advice, manage
          discretionary portfolios, or execute trades — and will not describe
          itself as doing so unless and until it holds the applicable license.
        </p>
        <Badge tone="info" className="mt-6">
          Technology and reporting layer — not a licensed advisor
        </Badge>
      </section>

      <SectionBlock title="Net worth overview" className="pt-0">
        <p>
          A consented, read-only aggregation of external accounts and
          custodied assets via open-banking connections — visually separated
          from your Ashford &amp; Crane account balances so the two are never
          conflated.
        </p>
      </SectionBlock>

      <SectionBlock title="Portfolio reporting" className="pt-0">
        <p>
          Holdings, allocation, and performance charts sourced from the
          custodian or asset manager of record — with that source attributed
          on every screen. Any model allocation is labelled &quot;Educational
          illustration only — not personalized investment advice.&quot;
        </p>
      </SectionBlock>

      <SectionBlock title="Risk-profile questionnaire" className="pt-0">
        <p>
          A structured intake that helps route you to an appropriate licensed
          advisory or execution-only partner. It is triage, not personalized
          advice. Advisory partner: [Pending].
        </p>
      </SectionBlock>

      <SectionBlock title="Document vault" className="pt-0">
        <p>
          Statements and reports from wealth partners delivered through the
          same Documents module used for banking statements — one place, one
          audit trail.
        </p>
      </SectionBlock>
    </>
  );
}
