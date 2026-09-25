import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor, entriesForAccount } from "@/server/domain/ledger";
import { Money } from "@/components/ui/Money";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Table, Td, Th } from "@/components/ui/Table";
import { TransactionFilters } from "./TransactionFilters";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; from?: string; to?: string; currency?: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const sp = await searchParams;
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const account = store.accounts.get(id);
  if (!account || account.customerId !== session.customerId) notFound();

  const all = entriesForAccount(store, id);
  const filtered = all.filter((x) => {
    const tx = x.transaction;
    if (sp.currency && x.currency !== sp.currency) return false;
    if (sp.from && tx.createdAt < Date.parse(sp.from)) return false;
    if (sp.to && tx.createdAt > Date.parse(sp.to)) return false;
    if (
      sp.q &&
      !tx.description.toLowerCase().includes(sp.q.toLowerCase()) &&
      !tx.reference.toLowerCase().includes(sp.q.toLowerCase())
    )
      return false;
    return true;
  });

  const balance = balanceFor(store, id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app/accounts"
          className="text-sm text-charcoal-500 hover:text-charcoal-900 dark:text-platinum-200"
        >
          Accounts
        </Link>
        <h1 className="mt-1 font-display text-3xl font-medium">
          {account.name}
        </h1>
        <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200 tnum">
          {account.identifier}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs text-charcoal-500 dark:text-platinum-200">
            Available balance
          </p>
          <p className="mt-1 text-2xl font-medium">
            <Money amountMinor={balance} currency={account.currency} />
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-charcoal-500 dark:text-platinum-200">
            Ledger balance
          </p>
          <p className="mt-1 text-2xl font-medium">
            <Money amountMinor={balance} currency={account.currency} />
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <TransactionFilters
          q={sp.q ?? ""}
          from={sp.from ?? ""}
          to={sp.to ?? ""}
          currency={sp.currency ?? ""}
          accountCurrency={account.currency}
        />
        <div className="flex gap-2">
          <ButtonLink
            href={`/api/v1/transactions?format=csv&accountId=${id}`}
            variant="secondary"
          >
            Export CSV
          </ButtonLink>
          {/* "PDF" export = print stylesheet */}
          <ButtonLink href={`/app/accounts/${id}/statement`} variant="ghost">
            Statement (print)
          </ButtonLink>
        </div>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Reference</Th>
              <Th numeric>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id}>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {new Date(x.transaction.createdAt).toLocaleDateString()}
                </Td>
                <Td>{x.transaction.description}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200 tnum">
                  {x.transaction.reference}
                </Td>
                <Td
                  numeric
                  className={
                    x.direction === "debit" ? "text-danger-600" : "text-success-600"
                  }
                >
                  <Money
                    amountMinor={
                      x.direction === "debit" ? -x.amountMinor : x.amountMinor
                    }
                    currency={x.currency}
                  />
                </Td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <Td colSpan={4} className="py-8 text-center text-charcoal-500 dark:text-platinum-200">
                  No transactions match these filters.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
