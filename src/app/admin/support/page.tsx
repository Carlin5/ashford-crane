import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Support" };

export default async function AdminSupport() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_customer_profiles") && !can(role, "view_customer_profiles_masked")) {
    return <Forbidden />;
  }
  const store = getStore();
  ensureSeed(store);
  const tickets = [...store.tickets.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Support tickets</h1>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Ticket</Th>
              <Th>Customer</Th>
              <Th>Subject</Th>
              <Th>Opened</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <Td>{t.id}</Td>
                <Td>{store.customers.get(t.customerId)?.name}</Td>
                <Td>{t.subject}</Td>
                <Td>{new Date(t.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Badge tone={t.status === "resolved" ? "success" : "warning"}>
                    {statusLabel(t.status)}
                  </Badge>
                </Td>
              </tr>
            ))}
            {tickets.length === 0 ? (
              <tr>
                <Td colSpan={5} className="text-center text-charcoal-500">
                  No tickets.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
