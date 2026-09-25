import { getStore } from "../store";
import { makeProviders } from "./providers/sandbox";
import { markProviderCompleted, markFailed } from "./transfers";
import { audit } from "./audit";
import { notifyCustomer } from "./notifications";

/**
 * Lazy status advancement on read: a Processing transfer is asked of the
 * banking provider; Completed is set only when the provider reports the
 * payment completed (deterministic ~10s after submission in the sandbox).
 */
export async function advanceTransfer(id: string) {
  const store = getStore();
  const t = store.transfers.get(id);
  if (!t || t.status !== "Processing") return t;
  const providers = makeProviders(store);
  const reported = await providers.banking.reportTransferStatus(id);
  if (reported === "completed") {
    try {
      markProviderCompleted(store, id);
      audit(store, {
        actorId: "system",
        actorRole: "operations_officer",
        action: "transfer.completed",
        target: id,
      });
      notifyCustomer(store, {
        customerId: t.customerId,
        kind: "transfer",
        text: `Transfer ${t.reference} is complete.`,
      });
    } catch {
      markFailed(store, id);
    }
  }
  return store.transfers.get(id);
}
