import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { piiMasked, maskEmail, maskKycData } from "@/server/pii";
import { balanceFor } from "@/server/domain/ledger";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_customer_profiles") && !can(role, "view_customer_profiles_masked")) {
    return <Forbidden />;
  }
  const masked = piiMasked(role);
  const { id } = await params;
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
    .slice(0, 10);
  const kycData = app ? maskKycData(app.data, masked) : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">{customer.name}</h1>
        <Badge tone="champagne">{customer.tier}</Badge>
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
        <h2 className="font-display text-xl font-medium">Users</h2>
        <div className="mt-3 space-y-2">
          {users.map((u) => (
            <Card key={u.id} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">{u.name}</span>
              <span className="text-sm text-charcoal-500 dark:text-platinum-200">
                {masked ? maskEmail(u.email) : u.email}
              </span>
            </Card>
          ))}
        </div>
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
                      {a.status}
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

      {app && kycData ? (
        <section>
          <h2 className="font-display text-xl font-medium">
            KYC application — {app.status}
          </h2>
          <Card className="mt-3 p-5">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {Object.entries(kycData).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-charcoal-500 dark:text-platinum-200">{k}</dt>
                  <dd>{String(v)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-medium">Recent activity</h2>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Account</Th>
                <Th numeric>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map(({ e, tx }) => (
                <tr key={e.id}>
                  <Td>{new Date(tx.createdAt).toLocaleDateString()}</Td>
                  <Td>{tx.description}</Td>
                  <Td>{e.accountId}</Td>
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
    </div>
  );
}
