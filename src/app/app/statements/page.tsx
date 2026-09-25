import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Statements" };

export default async function StatementsPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const myIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === session.customerId)
      .map((a) => a.id),
  );
  const months = new Map<string, number>();
  for (const e of store.entries.values()) {
    if (!myIds.has(e.accountId)) continue;
    const tx = store.transactions.get(e.transactionId);
    if (!tx) continue;
    const key = new Date(tx.createdAt).toISOString().slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + 1);
  }
  const list = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Statements</h1>
      {list.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-charcoal-500 dark:text-platinum-200">
            No statements yet — they appear here monthly once your account is
            active.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map(([month, count]) => (
            <Card key={month} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium tnum">{month}</p>
                <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                  {count} transactions
                </p>
              </div>
              <ButtonLink
                href={`/api/v1/transactions?format=csv&from=${month}-01`}
                variant="secondary"
              >
                Download CSV
              </ButtonLink>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
