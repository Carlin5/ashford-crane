import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor, entriesForAccount } from "@/server/domain/ledger";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Statement" };

/** Printable statement — the app's "PDF" export via print stylesheet. */
export default async function StatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  const account = store.accounts.get(id);
  if (!account || account.customerId !== session.customerId) notFound();
  const entries = entriesForAccount(store, id);

  return (
    <div className="mx-auto max-w-3xl p-8 print:p-0">
      <header className="flex items-baseline justify-between border-b pb-4">
        <h1 className="font-display text-2xl">Ashford &amp; Crane — Statement</h1>
        <p className="text-sm">DEMO ENVIRONMENT — fictional data</p>
      </header>
      <dl className="mt-6 grid grid-cols-2 gap-2 text-sm">
        <dt className="font-medium">Account</dt>
        <dd>{account.name} — {account.identifier}</dd>
        <dt className="font-medium">Balance</dt>
        <dd>{formatMoney(balanceFor(store, id), account.currency)}</dd>
        <dt className="font-medium">Generated</dt>
        <dd>{new Date().toLocaleString()}</dd>
      </dl>
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b text-start">
            <th className="py-2 text-start">Date</th>
            <th className="text-start">Description</th>
            <th className="text-start">Reference</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((x) => (
            <tr key={x.id} className="border-b">
              <td className="py-2">{new Date(x.transaction.createdAt).toLocaleDateString()}</td>
              <td>{x.transaction.description}</td>
              <td>{x.transaction.reference}</td>
              <td className="text-end tnum">
                {formatMoney(
                  x.direction === "debit" ? -x.amountMinor : x.amountMinor,
                  x.currency,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-xs text-charcoal-500">
        Use your browser&apos;s print dialog to save this statement as PDF.
      </p>
    </div>
  );
}
