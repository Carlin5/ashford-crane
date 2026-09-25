import { statusLabel, tierLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { assignedCustomers } from "@/app/rm/lib";
import { requestCustomerEdit } from "@/app/rm/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";

export const metadata: Metadata = { title: "Client" };

export default async function RmClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { assignedIds } = await assignedCustomers();
  const { id } = await params;
  if (!assignedIds.includes(id)) notFound();
  const store = getStore();
  ensureSeed(store);
  const customer = store.customers.get(id);
  if (!customer) notFound();

  const users = [...store.users.values()].filter((u) => u.customerId === id);
  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId === id,
  );
  const app = [...store.kycApplications.values()].find(
    (a) => a.applicantEmail === users[0]?.email,
  );
  const accountIds = new Set(accounts.map((a) => a.id));
  const recent = [...store.entries.values()]
    .filter((e) => accountIds.has(e.accountId))
    .map((e) => ({ e, tx: store.transactions.get(e.transactionId)! }))
    .filter((x) => x.tx)
    .sort((a, b) => b.tx.createdAt - a.tx.createdAt)
    .slice(0, 8);
  const docs = app?.documents ?? [];

  async function requestEdit(formData: FormData) {
    "use server";
    await requestCustomerEdit(id, formData);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">{customer.name}</h1>
        <Badge tone="champagne">{tierLabel(customer.tier)}</Badge>
        <Badge
          tone={
            customer.riskRating === "high"
              ? "danger"
              : customer.riskRating === "medium"
                ? "warning"
                : "success"
          }
        >
          {customer.riskRating ?? "unrated"} risk
        </Badge>
      </div>

      <section>
        <h2 className="font-display text-xl font-medium">KYC status</h2>
        <Card className="mt-3 p-5 text-sm">
          {app ? (
            <>
              <p>
                Application {app.id} — <Badge tone="info">{statusLabel(app.status)}</Badge>
              </p>
              <p className="mt-2 text-charcoal-500 dark:text-platinum-200">
                Submitted {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p>No application on file.</p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Accounts</h2>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Account</Th>
                <Th>Identifier</Th>
                <Th>Status</Th>
                <Th numeric>Balance</Th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <Td>{a.name}</Td>
                  <Td>{a.identifier}</Td>
                  <Td>
                    <Badge tone={a.status === "active" ? "success" : "warning"}>
                      {statusLabel(a.status)}
                    </Badge>
                  </Td>
                  <Td numeric>
                    <Money amountMinor={balanceFor(store, a.id)} currency={a.currency} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Recent activity</h2>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th numeric>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map(({ e, tx }) => (
                <tr key={e.id}>
                  <Td>{new Date(tx.createdAt).toLocaleDateString()}</Td>
                  <Td>{tx.description}</Td>
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
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Documents</h2>
        <div className="mt-3 space-y-2">
          {docs.length === 0 ? (
            <p className="text-sm text-charcoal-500">None on file.</p>
          ) : (
            docs.map((d, i) => (
              <Card key={i} className="flex items-center justify-between p-4 text-sm">
                <span>{d.name}</span>
                <span className="text-charcoal-500 dark:text-platinum-200">
                  {d.type}
                </span>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">
          Request a customer-data change
        </h2>
        <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
          Requests go to operations; you cannot edit customer records directly.
        </p>
        <form action={requestEdit} className="mt-3 flex gap-2">
          <Input
            name="detail"
            placeholder="Describe the change needed"
            required
          />
          <Button type="submit" variant="secondary">
            Request edit
          </Button>
        </form>
      </section>
    </div>
  );
}
