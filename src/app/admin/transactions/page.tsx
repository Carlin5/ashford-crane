import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";
import { Select } from "@/components/ui/Select";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Transactions" };

export default async function AdminTransactions({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string; currency?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_customer_profiles") && !can(role, "view_customer_profiles_masked")) {
    return <Forbidden />;
  }
  const { accountId, currency } = await searchParams;
  const store = getStore();
  ensureSeed(store);

  let entries = [...store.entries.values()]
    .filter((e) => store.accounts.get(e.accountId)?.customerId !== "platform")
    .map((e) => ({ e, tx: store.transactions.get(e.transactionId)! }))
    .filter((x) => x.tx);
  if (accountId) entries = entries.filter((x) => x.e.accountId === accountId);
  if (currency) entries = entries.filter((x) => x.e.currency === currency);
  entries.sort((a, b) => b.tx.createdAt - a.tx.createdAt);

  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId !== "platform",
  );
  const currencies = [...new Set(entries.map((x) => x.e.currency))];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Transactions</h1>
      <form className="flex flex-wrap items-end gap-3">
        <Select name="accountId" label="Account" defaultValue={accountId ?? ""}>
          <option value="">All accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.identifier}
            </option>
          ))}
        </Select>
        <Select name="currency" label="Currency" defaultValue={currency ?? ""}>
          <option value="">All currencies</option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <button
          type="submit"
          className="rounded-lg border border-platinum-200 px-4 py-2 text-sm hover:bg-platinum-100 dark:border-navy-700 dark:hover:bg-navy-700"
        >
          Filter
        </button>
      </form>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Reference</Th>
              <Th>Account</Th>
              <Th>Status</Th>
              <Th numeric>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 120).map(({ e, tx }) => (
              <tr key={e.id}>
                <Td>{new Date(tx.createdAt).toLocaleDateString()}</Td>
                <Td>{tx.description}</Td>
                <Td>{tx.reference}</Td>
                <Td>{store.accounts.get(e.accountId)?.identifier}</Td>
                <Td>
                  <Badge tone={tx.status === "reversed" ? "warning" : "neutral"}>
                    {tx.status}
                  </Badge>
                </Td>
                <Td numeric>
                  <Money
                    amountMinor={e.direction === "debit" ? -e.amountMinor : e.amountMinor}
                    currency={e.currency}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
