import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";
import { TransferWizard } from "./TransferWizard";

export const metadata: Metadata = { title: "New transfer" };

export default async function NewTransferPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  const accounts = [...store.accounts.values()]
    .filter((a) => a.customerId === session.customerId)
    .map((a) => ({
      id: a.id,
      name: a.name,
      currency: a.currency,
      identifier: a.identifier,
      balanceMinor: balanceFor(store, a.id),
    }));
  const beneficiaries = [...store.beneficiaries.values()]
    .filter((b) => b.customerId === session.customerId)
    .map((b) => ({ id: b.id, name: b.name, currency: b.currency, bankName: b.bankName }));
  const customer = store.customers.get(session.customerId!);
  const corporate = customer?.tier === "corporate" || customer?.tier === "institutional";

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">New transfer</h1>
      <TransferWizard
        accounts={accounts}
        beneficiaries={beneficiaries}
        corporate={corporate}
      />
    </div>
  );
}
