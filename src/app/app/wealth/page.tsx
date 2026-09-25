import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { AllocationChart } from "@/components/app/AllocationChart";

export const metadata: Metadata = { title: "Wealth" };

export default async function WealthPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId === session.customerId,
  );
  const ownTotal = accounts.reduce((n, a) => n + balanceFor(store, a.id), 0);

  // Fictional external aggregation, clearly labelled and separated.
  const external = [
    { label: "External brokerage (illustration)", amountMinor: 1_240_000, currency: "USD" as const },
    { label: "Custodied assets (illustration)", amountMinor: 830_000, currency: "USD" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium">Wealth</h1>
        <Badge tone="info" className="mt-3">
          Technology and reporting layer — not personalized investment advice
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card elevated className="p-6">
          <h2 className="font-medium">Ashford &amp; Crane accounts</h2>
          <p className="mt-2 text-2xl font-medium">
            <Money amountMinor={ownTotal} currency="USD" />
          </p>
          <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
            Sum of balances across your accounts, shown at face value per
            currency (USD-listed figures only for this demo view).
          </p>
        </Card>
        <Card className="border-dashed p-6">
          <h2 className="font-medium">External holdings — aggregated</h2>
          <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
            Consented, read-only aggregation. Source: custodian of record —
            attributed per holding.
          </p>
          <ul className="mt-4 space-y-3">
            {external.map((x) => (
              <li key={x.label} className="flex items-center justify-between text-sm">
                <span>{x.label}</span>
                <Money amountMinor={x.amountMinor} currency={x.currency} className="font-medium" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-medium">Allocation</h2>
        <p className="mt-1 text-xs font-medium text-warning-600">
          Educational illustration only — not personalized investment advice.
        </p>
        <AllocationChart />
      </Card>

      <Card className="p-6">
        <h2 className="font-medium">Risk-profile questionnaire</h2>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-500 dark:text-platinum-200">
          A short structured intake that routes you to an appropriate licensed
          advisory or execution-only partner. This is triage, not personalized
          advice. Advisory partner: [Pending].
        </p>
        <button className="mt-4 rounded-lg border border-platinum-200 px-4 py-2 text-sm dark:border-navy-700">
          Start questionnaire (routes to partner — [Pending])
        </button>
      </Card>
    </div>
  );
}
