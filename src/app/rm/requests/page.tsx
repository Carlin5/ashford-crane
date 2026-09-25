import type { Metadata } from "next";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { assignedCustomers } from "@/app/rm/lib";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";

export const metadata: Metadata = { title: "Service Requests" };

export default async function RmRequests() {
  const { assignedIds } = await assignedCustomers();
  const store = getStore();
  ensureSeed(store);
  const tickets = [...store.tickets.values()]
    .filter((t) => assignedIds.includes(t.customerId))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Service requests</h1>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
          Requests you have filed on behalf of assigned clients. New edit
          requests are filed from a client&apos;s profile page.
        </p>
      </div>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Request</Th>
              <Th>Client</Th>
              <Th>Filed</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <Td>{t.subject}</Td>
                <Td>{store.customers.get(t.customerId)?.name}</Td>
                <Td>{new Date(t.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Badge tone={t.status === "resolved" ? "success" : "warning"}>
                    {t.status.replaceAll("_", " ")}
                  </Badge>
                </Td>
              </tr>
            ))}
            {tickets.length === 0 ? (
              <tr>
                <Td colSpan={4} className="text-center text-charcoal-500">
                  No requests filed.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
