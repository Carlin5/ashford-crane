import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { balanceFor } from "@/server/domain/ledger";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Accounts" };

export default async function AdminAccounts() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_customer_profiles") && !can(role, "view_customer_profiles_masked")) {
    return <Forbidden />;
  }
  const store = getStore();
  ensureSeed(store);
  const accounts = [...store.accounts.values()].filter(
    (a) => a.customerId !== "platform",
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Accounts</h1>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Account</Th>
              <Th>Identifier</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th numeric>Balance</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id}>
                <Td>{a.name}</Td>
                <Td>{a.identifier}</Td>
                <Td>{store.customers.get(a.customerId)?.name ?? a.customerId}</Td>
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
    </div>
  );
}
