import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { makeProviders } from "@/server/domain/providers/sandbox";
import { ProviderUnavailableError } from "@/server/domain/providers/interfaces";
import { Money } from "@/components/ui/Money";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { TotalBalance } from "@/components/app/TotalBalance";
import { FxTicker } from "@/components/app/FxTicker";
import { RelativeTime } from "@/components/ui/RelativeTime";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function OverviewPage() {
  const session = await getSession();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium">
          {greeting()}, {session.name?.split(" ")[0]}
        </h1>
      </header>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <BalancePanel customerId={session.customerId!} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        <FxPanel />
      </Suspense>
      <Suspense fallback={<Skeleton lines={4} />}>
        <ActivityPanel customerId={session.customerId!} />
      </Suspense>
    </div>
  );
}

async function BalancePanel({ customerId }: { customerId: string }) {
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId === customerId,
  );
  let bankingDown = false;
  const providerBalances = new Map<string, number>();
  try {
    const providers = makeProviders(store);
    for (const a of accounts) {
      providerBalances.set(a.id, await providers.banking.getBalance(a.id));
    }
  } catch (e) {
    if (!(e instanceof ProviderUnavailableError)) throw e;
    bankingDown = true;
  }
  const usdTotal = accounts
    .filter((a) => a.currency === "USD")
    .reduce((n, a) => n + balanceFor(store, a.id), 0);

  return (
    <section aria-label="Balances" className="space-y-4">
      <Card elevated className="p-6">
        <p className="text-sm text-charcoal-500 dark:text-platinum-200">
          Total Available Balance (USD accounts)
        </p>
        <p className="mt-2 font-display text-4xl font-medium">
          <TotalBalance amountMinor={usdTotal} currency="USD" />
        </p>
        {bankingDown ? (
          <p className="mt-3 rounded-lg border border-warning-600/40 bg-warning-600/5 p-3 text-sm text-warning-600">
            We couldn&apos;t refresh your balance just now — showing the last
            known value.
          </p>
        ) : null}
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => (
          <Link key={a.id} href={`/app/accounts/${a.id}`}>
            <Card className="p-5 transition-colors hover:bg-platinum-100/60 dark:hover:bg-navy-900/40">
              <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                {a.name} · {a.identifier}
              </p>
              <p className="mt-2 text-2xl font-medium">
                <Money amountMinor={balanceFor(store, a.id)} currency={a.currency} />
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function FxPanel() {
  const store = getStore();
  ensureSeed(store);
  await delay(200);
  let down = false;
  let rate = 0;
  try {
    rate = await makeProviders(store).fx.getRate("USD", "EUR");
  } catch (e) {
    if (!(e instanceof ProviderUnavailableError)) throw e;
    down = true;
  }
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">USD → EUR reference rate</h2>
        <RelativeTime at={Date.now()} prefix="updated" />
      </div>
      {down ? (
        <p className="mt-2 text-sm text-warning-600">
          We couldn&apos;t refresh rates just now — showing the last known
          value.
        </p>
      ) : (
        <FxTicker from="USD" to="EUR" initialRate={rate} />
      )}
    </Card>
  );
}

async function ActivityPanel({ customerId }: { customerId: string }) {
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const myIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === customerId)
      .map((a) => a.id),
  );
  const recent = [...store.entries.values()]
    .filter((e) => myIds.has(e.accountId))
    .map((e) => ({ e, tx: store.transactions.get(e.transactionId)! }))
    .filter((x) => x.tx)
    .sort((a, b) => b.tx.createdAt - a.tx.createdAt)
    .slice(0, 8);

  return (
    <section aria-label="Recent activity">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-medium">Recent activity</h2>
        <Link
          href="/app/transactions"
          className="text-sm text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
        >
          View all
        </Link>
      </div>
      <Card className="mt-4 divide-y divide-platinum-200/60 dark:divide-navy-700/60">
        {recent.map(({ e, tx }) => (
          <div key={e.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm">{tx.description}</p>
              <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                {new Date(tx.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Money
              amountMinor={e.direction === "debit" ? -e.amountMinor : e.amountMinor}
              currency={e.currency}
              className={e.direction === "debit" ? "text-danger-600" : "text-success-600"}
            />
          </div>
        ))}
      </Card>
    </section>
  );
}
