import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/ui/Money";
import { Badge } from "@/components/ui/Badge";
import { CardControls } from "@/components/app/CardControls";

export const metadata: Metadata = { title: "Cards" };

export default async function CardsPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const cards = [...store.cards.values()].filter(
    (c) => c.customerId === session.customerId,
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Cards</h1>
      {cards.length === 0 ? (
        <Card className="p-10 text-center">
          <h2 className="font-display text-xl font-medium">No cards yet</h2>
          <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
            Request your first card and it will appear here with controls you
            manage yourself.
          </p>
          <button className="mt-6 rounded-lg bg-champagne-500 px-5 py-2.5 text-sm font-medium text-navy-900">
            Request your first card
          </button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((c) => {
            const account = store.accounts.get(c.accountId);
            return (
              <Card key={c.id} elevated className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medium">{c.label}</h2>
                    <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200 tnum">
                      •••• {c.last4}, exp {c.expiry}
                    </p>
                  </div>
                  <Badge tone={c.status === "frozen" ? "warning" : "success"}>
                    {c.status === "frozen" ? "Frozen" : "Active"}
                  </Badge>
                </div>
                {account ? (
                  <p className="mt-4 text-sm text-charcoal-500 dark:text-platinum-200">
                    Linked to {account.name},{" "}
                    <Money
                      amountMinor={balanceFor(store, account.id)}
                      currency={account.currency}
                    />
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
                  Spending limit:{" "}
                  <Money amountMinor={c.limitMinor} currency={account?.currency ?? "USD"} />
                </p>
                <CardControls card={c} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Change PIN", "Request replacement", "Report lost"].map(
                    (a) => (
                      <span
                        key={a}
                        className="rounded-md border border-platinum-200 px-3 py-1.5 text-xs text-charcoal-500 dark:border-navy-700 dark:text-platinum-200"
                        title="Creates a service request"
                      >
                        {a}
                      </span>
                    ),
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <p className="text-xs text-charcoal-500 dark:text-platinum-200">
        ATM availability depends on the card network, issuer, country, and
        local ATM operator; local surcharges may apply.
      </p>
    </div>
  );
}
