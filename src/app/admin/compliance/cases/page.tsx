import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Compliance Cases" };

export default async function CasesPage() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_compliance")) return <Forbidden />;
  const store = getStore();
  ensureSeed(store);
  const cases = [...store.cases.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
  const TONE = {
    open: "warning",
    assigned: "info",
    info_requested: "warning",
    escalated: "danger",
    closed: "success",
  } as const;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Compliance cases</h1>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Case</Th>
              <Th>Customer</Th>
              <Th>Opened</Th>
              <Th>Assignee</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <Td>
                  <Link
                    href={`/admin/compliance/cases/${c.id}`}
                    className="font-medium text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
                  >
                    {c.id}
                  </Link>
                </Td>
                <Td>{store.customers.get(c.customerId)?.name}</Td>
                <Td>{new Date(c.createdAt).toLocaleDateString()}</Td>
                <Td>{c.assigneeId ?? "—"}</Td>
                <Td>
                  <Badge tone={TONE[c.status]}>{c.status.replaceAll("_", " ")}</Badge>
                </Td>
              </tr>
            ))}
            {cases.length === 0 ? (
              <tr>
                <Td colSpan={5} className="text-center text-charcoal-500">
                  No cases.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
