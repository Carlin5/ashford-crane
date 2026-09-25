import { statusLabel } from "@/lib/labels";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/ui/Money";
import { TransferStatusStepper } from "@/components/app/TransferStatusStepper";
import { advanceTransfer } from "@/server/domain/transfer-lifecycle";

export const metadata: Metadata = { title: "Transfer" };

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const t = await advanceTransfer(id);
  if (!t || t.customerId !== session.customerId) notFound();
  const ben = store.beneficiaries.get(t.beneficiaryId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app/transfers"
          className="text-sm text-charcoal-500 hover:text-charcoal-900 dark:text-platinum-200"
        >
          Transfers
        </Link>
        <h1 className="mt-1 font-display text-3xl font-medium">
          Transfer {t.reference}
        </h1>
      </div>

      <Card elevated className="p-6">
        <TransferStatusStepper status={t.status} />
        {t.requiresApproval && t.approvals.length < 2 ? (
          <p className="mt-4 rounded-lg border border-warning-600/40 bg-warning-600/5 p-3 text-sm text-warning-600">
            {t.approvals.length} of 2 authorizations — this transfer requires
            dual control before it can proceed.
          </p>
        ) : null}
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">To</dt>
            <dd className="font-medium">{ben?.name}</dd>
          </div>
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">You sent</dt>
            <dd className="font-medium">
              <Money amountMinor={t.amountMinor} currency={t.currency} />
            </dd>
          </div>
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">Fee</dt>
            <dd className="font-medium">
              <Money amountMinor={t.feeMinor} currency={t.currency} />
            </dd>
          </div>
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">Rate</dt>
            <dd className="font-medium tnum">{t.fxRate?.toFixed(4) ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">
              Recipient gets
            </dt>
            <dd className="font-medium">
              {t.recipientAmountMinor != null ? (
                <Money
                  amountMinor={t.recipientAmountMinor}
                  currency={t.recipientCurrency ?? t.currency}
                />
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-charcoal-500 dark:text-platinum-200">Status</dt>
            <dd className="font-medium">{statusLabel(t.status)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
