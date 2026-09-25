import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/ui/Money";
import { Table, Td, Th } from "@/components/ui/Table";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; currency?: string; from?: string; to?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const myIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === session.customerId)
      .map((a) => a.id),
  );
  const rows = [...store.entries.values()]
    .filter((e) => myIds.has(e.accountId))
    .map((e) => ({ e, tx: store.transactions.get(e.transactionId)! }))
    .filter((x) => x.tx)
    .filter(({ e, tx }) => {
      if (sp.currency && e.currency !== sp.currency) return false;
      if (sp.from && tx.createdAt < Date.parse(sp.from)) return false;
      if (sp.to && tx.createdAt > Date.parse(sp.to)) return false;
      if (sp.q && !tx.description.toLowerCase().includes(sp.q.toLowerCase()) && !tx.reference.toLowerCase().includes(sp.q.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.tx.createdAt - a.tx.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium">Transactions</h1>
        <ButtonLink href="/api/v1/transactions?format=csv" variant="secondary">
          Export CSV
        </ButtonLink>
      </div>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Account</Th>
              <Th>Description</Th>
              <Th>Reference</Th>
              <Th numeric>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ e, tx }) => (
              <tr key={e.id}>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </Td>
                <Td className="tnum">{e.accountId.replace("acct_", "").toUpperCase()}</Td>
                <Td>{tx.description}</Td>
                <Td className="tnum text-charcoal-500 dark:text-platinum-200">{tx.reference}</Td>
                <Td numeric className={e.direction === "debit" ? "text-danger-600" : "text-success-600"}>
                  <Money amountMinor={e.direction === "debit" ? -e.amountMinor : e.amountMinor} currency={e.currency} />
                </Td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <Td colSpan={5} className="py-8 text-center text-charcoal-500 dark:text-platinum-200">
                  No transactions found.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
