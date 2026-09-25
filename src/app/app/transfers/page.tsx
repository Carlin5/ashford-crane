import { statusLabel } from "@/lib/labels";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { TransferStatusStepper } from "@/components/app/TransferStatusStepper";

export const metadata: Metadata = { title: "Transfers" };

const TONE: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
  Completed: "success",
  Processing: "info",
  PendingVerification: "warning",
  Failed: "danger",
  Rejected: "danger",
  Cancelled: "neutral",
  Draft: "neutral",
};

export default async function TransfersPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const transfers = [...store.transfers.values()]
    .filter((t) => t.customerId === session.customerId)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-medium">Transfers</h1>
        <ButtonLink href="/app/transfers/new">New transfer</ButtonLink>
      </div>
      {transfers.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-charcoal-500 dark:text-platinum-200">
            No transfers yet — send your first international transfer.
          </p>
          <ButtonLink href="/app/transfers/new" className="mt-6">
            New transfer
          </ButtonLink>
        </Card>
      ) : (
        <div className="space-y-4">
          {transfers.map((t) => {
            const ben = store.beneficiaries.get(t.beneficiaryId);
            return (
              <Link key={t.id} href={`/app/transfers/${t.id}`}>
                <Card className="p-5 transition-colors hover:bg-platinum-100/60 dark:hover:bg-navy-900/40">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        To {ben?.name ?? "beneficiary"}
                      </p>
                      <p className="text-xs text-charcoal-500 dark:text-platinum-200 tnum">
                        {t.reference}
                      </p>
                    </div>
                    <div className="text-end">
                      <Money amountMinor={t.amountMinor} currency={t.currency} className="font-medium" />
                      <div className="mt-1">
                        <Badge tone={TONE[t.status]}>{statusLabel(t.status)}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <TransferStatusStepper status={t.status} compact />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
