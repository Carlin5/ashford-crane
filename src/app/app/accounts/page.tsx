import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { Money } from "@/components/ui/Money";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Accounts" };

export default async function AccountsPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId === session.customerId,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Accounts</h1>
      {accounts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-charcoal-500 dark:text-platinum-200">
            No accounts yet — once your application is approved, your accounts
            will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => (
            <Link key={a.id} href={`/app/accounts/${a.id}`}>
              <Card className="p-5 transition-colors hover:bg-platinum-100/60 dark:hover:bg-navy-900/40">
                <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                  {a.name}
                </p>
                <p className="mt-2 text-2xl font-medium">
                  <Money amountMinor={balanceFor(store, a.id)} currency={a.currency} />
                </p>
                <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200 tnum">
                  {a.identifier}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
