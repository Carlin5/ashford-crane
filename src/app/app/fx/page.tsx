import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { FxQuoteTool } from "@/components/app/FxQuoteTool";

export const metadata: Metadata = { title: "FX" };

export default async function FxPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const currencies = [...new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === session.customerId)
      .map((a) => a.currency),
  )];
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Foreign exchange</h1>
      <p className="max-w-2xl text-sm text-charcoal-500 dark:text-platinum-200">
        Every quote names its reference-rate source and the spread applied.
        Quotes are indicative until confirmed in a transfer.
      </p>
      <Card className="p-6">
        <FxQuoteTool currencies={currencies.length ? currencies : ["USD", "EUR", "GBP", "UGX", "KES", "AED"]} />
      </Card>
    </div>
  );
}
