import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { auditTrail } from "@/server/domain/audit";
import { Card } from "@/components/ui/Card";
import { Table, Th, Td } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Audit Logs" };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ actor?: string; action?: string; target?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_audit")) return <Forbidden />;
  const { actor, action, target } = await searchParams;
  const store = getStore();
  ensureSeed(store);
  let entries = auditTrail(store);
  if (actor) entries = entries.filter((e) => e.actorId.includes(actor));
  if (action) entries = entries.filter((e) => e.action.includes(action));
  if (target) entries = entries.filter((e) => e.target.includes(target));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Audit logs</h1>
      <p className="text-sm text-charcoal-500 dark:text-platinum-200">
        Append-only. Entries are never edited or deleted.
      </p>
      <form className="flex flex-wrap items-end gap-3">
        <Input name="actor" label="Actor" defaultValue={actor ?? ""} />
        <Input name="action" label="Action" defaultValue={action ?? ""} />
        <Input name="target" label="Entity" defaultValue={target ?? ""} />
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
              <Th>Time</Th>
              <Th>Actor</Th>
              <Th>Role</Th>
              <Th>Action</Th>
              <Th>Entity</Th>
              <Th>Detail</Th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 200).map((e) => (
              <tr key={e.id}>
                <Td className="whitespace-nowrap">
                  {new Date(e.at).toLocaleString()}
                </Td>
                <Td>{e.actorId}</Td>
                <Td>{e.actorRole.replaceAll("_", " ")}</Td>
                <Td>{e.action}</Td>
                <Td>{e.target}</Td>
                <Td className="max-w-xs truncate">{e.detail ?? "—"}</Td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <Td colSpan={6} className="text-center text-charcoal-500">
                  No matching entries.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
