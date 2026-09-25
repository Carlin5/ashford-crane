import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { advanceTransfer } from "@/server/domain/transfer-lifecycle";
import { approveTransferAction, rejectTransferAction } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";
import type { TransferStatus } from "@/server/types";

export const metadata: Metadata = { title: "Transfers" };

const TONE: Record<TransferStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Draft: "neutral",
  PendingVerification: "warning",
  Processing: "info",
  Completed: "success",
  Failed: "danger",
  Rejected: "danger",
  Cancelled: "neutral",
};

export default async function AdminTransfers({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  const canView =
    can(role, "view_customer_profiles") ||
    can(role, "view_customer_profiles_masked") ||
    can(role, "view_compliance") ||
    can(role, "approve_transfers");
  if (!canView) return <Forbidden />;
  const { error } = await searchParams;
  const store = getStore();
  ensureSeed(store);

  // Lazy-advance any Processing transfers so statuses are fresh.
  for (const t of store.transfers.values()) {
    if (t.status === "Processing") await advanceTransfer(t.id);
  }

  const transfers = [...store.transfers.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
  const pending = transfers.filter((t) => t.status === "PendingVerification");
  const approver = can(role, "approve_transfers");

  async function approve(id: string) {
    "use server";
    const r = await approveTransferAction(id);
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(`/admin/transfers?error=${encodeURIComponent(r.error)}`);
    }
  }
  async function reject(id: string) {
    "use server";
    const r = await rejectTransferAction(id);
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(`/admin/transfers?error=${encodeURIComponent(r.error)}`);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium">Transfers</h1>
      {error ? (
        <p className="rounded-lg border border-danger-600/40 bg-danger-600/5 p-3 text-sm text-danger-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-medium">
          Pending approval ({pending.length})
        </h2>
        <div className="mt-3 space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              Nothing awaiting authorization.
            </p>
          ) : (
            pending.map((t) => {
              const mine = t.approvals.includes(session.userId!);
              return (
                <Card key={t.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{t.reference}</p>
                      <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
                        {store.customers.get(t.customerId)?.name},{" "}
                        {store.beneficiaries.get(t.beneficiaryId)?.name},{" "}
                        <Money amountMinor={t.amountMinor} currency={t.currency} />
                      </p>
                      <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
                        {t.approvals.length} of 2 authorizations
                        {mine ? " — you have already authorized" : ""}
                      </p>
                    </div>
                    {approver ? (
                      <div className="flex gap-2">
                        <form action={approve.bind(null, t.id)}>
                          <Button type="submit" disabled={mine}>
                            Authorize
                          </Button>
                        </form>
                        <form action={reject.bind(null, t.id)}>
                          <Button type="submit" variant="secondary">
                            Reject
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <Badge tone="neutral">Read-only</Badge>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">All transfers</h2>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Customer</Th>
                <Th>Beneficiary</Th>
                <Th>Status</Th>
                <Th>Approvals</Th>
                <Th numeric>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id}>
                  <Td>{t.reference}</Td>
                  <Td>{store.customers.get(t.customerId)?.name}</Td>
                  <Td>{store.beneficiaries.get(t.beneficiaryId)?.name}</Td>
                  <Td>
                    <Badge tone={TONE[t.status]}>{t.status}</Badge>
                  </Td>
                  <Td>{t.approvals.length}</Td>
                  <Td numeric>
                    <Money amountMinor={t.amountMinor} currency={t.currency} />
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
