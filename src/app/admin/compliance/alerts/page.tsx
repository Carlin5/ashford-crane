import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { openCaseFromAlert } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Compliance Alerts" };

export default async function AlertsPage() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_compliance")) return <Forbidden />;
  const store = getStore();
  ensureSeed(store);
  const alerts = [...store.alerts.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
  const caseManager = can(role, "manage_cases");

  async function openCaseAction(alertId: string) {
    "use server";
    await openCaseFromAlert(alertId);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Compliance alerts</h1>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Alert</Th>
              <Th>Customer</Th>
              <Th>Kind</Th>
              <Th>Raised</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <Td className="max-w-md">{a.detail}</Td>
                <Td>{store.customers.get(a.customerId)?.name}</Td>
                <Td>{a.kind.replaceAll("_", " ")}</Td>
                <Td>{new Date(a.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Badge tone={a.status === "open" ? "warning" : "neutral"}>
                    {statusLabel(a.status)}
                  </Badge>
                </Td>
                <Td>
                  {caseManager && a.status === "open" ? (
                    <form action={openCaseAction.bind(null, a.id)}>
                      <Button type="submit" variant="secondary">
                        Open case
                      </Button>
                    </form>
                  ) : null}
                </Td>
              </tr>
            ))}
            {alerts.length === 0 ? (
              <tr>
                <Td colSpan={6} className="text-center text-charcoal-500">
                  No alerts.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
