import { nextId, type InMemoryStore } from "../store";
import { postTransaction, balanceFor } from "./ledger";
import { assertDualControl, can, DualControlError } from "./rbac";
import type { Role, Transfer, TransferStatus } from "../types";
import type { Currency } from "@/lib/money";

/** Forward-only state machine — a status never moves backwards. */
const FORWARD: Record<TransferStatus, TransferStatus[]> = {
  Draft: ["PendingVerification", "Cancelled"],
  PendingVerification: ["Processing", "Rejected", "Cancelled"],
  Processing: ["Completed", "Failed"],
  Completed: [],
  Failed: [],
  Rejected: [],
  Cancelled: [],
};

const ORDER: TransferStatus[] = [
  "Draft",
  "PendingVerification",
  "Processing",
  "Completed",
  "Failed",
  "Rejected",
  "Cancelled",
];

export function assertForward(from: TransferStatus, to: TransferStatus): void {
  if (!FORWARD[from].includes(to)) {
    throw new Error(`Transfer cannot move from ${from} to ${to}`);
  }
}

export function statusIndex(status: TransferStatus): number {
  return ORDER.indexOf(status);
}

export function createTransfer(
  store: InMemoryStore,
  input: {
    customerId: string;
    createdBy: string;
    sourceAccountId: string;
    beneficiaryId: string;
    currency: Currency;
    amountMinor: number;
    feeMinor: number;
    recipientAmountMinor?: number;
    recipientCurrency?: Currency;
    fxRate?: number;
    requiresApproval?: boolean;
    scheduledFor?: number;
  },
): Transfer {
  const t: Transfer = {
    id: nextId(store, "trf"),
    status: "Draft",
    reference: `AC-${String(Date.now()).slice(-8)}-${nextId(store, "ref").slice(-4)}`,
    requiresApproval: input.requiresApproval ?? false,
    approvals: [],
    createdAt: Date.now(),
    ...input,
  };
  store.transfers.set(t.id, t);
  return t;
}

/** Submit for verification; corporate tiers route through approval first. */
export function submitTransfer(
  store: InMemoryStore,
  transferId: string,
): Transfer {
  const t = mustGet(store, transferId);
  assertForward(t.status, "PendingVerification");
  t.status = "PendingVerification";
  t.submittedAt = Date.now();
  return t;
}

/**
 * Corporate/Institutional dual control: two distinct staff authorizers.
 * Returns the transfer; status only reaches Processing when both approvals
 * are recorded ("1 of 2 authorizations" in the UI meanwhile).
 */
export function approveTransfer(
  store: InMemoryStore,
  transferId: string,
  approver: { userId: string; role: Role },
): Transfer {
  const t = mustGet(store, transferId);
  if (!can(approver.role, "approve_transfers")) {
    throw new DualControlError(
      `Role ${approver.role} cannot authorize fund movements`,
    );
  }
  if (t.approvals.includes(approver.userId)) {
    throw new DualControlError(
      "You have already authorized this transfer — a second, distinct authorizer is required",
    );
  }
  t.approvals.push(approver.userId);
  if (t.approvals.length >= 2) {
    assertDualControl(
      { userId: t.approvals[0], role: approver.role },
      { userId: t.approvals[1], role: approver.role },
    );
    if (t.status === "PendingVerification") {
      assertForward(t.status, "Processing");
      t.status = "Processing";
    }
  }
  return t;
}

/** Move a verified non-corporate transfer into processing. */
export function authorizeTransfer(
  store: InMemoryStore,
  transferId: string,
): Transfer {
  const t = mustGet(store, transferId);
  if (t.requiresApproval && t.approvals.length < 2) {
    throw new Error("Transfer requires two authorizations before processing");
  }
  assertForward(t.status, "Processing");
  t.status = "Processing";
  t.submittedAt = t.submittedAt ?? Date.now();
  return t;
}

export function cancelTransfer(
  store: InMemoryStore,
  transferId: string,
): Transfer {
  const t = mustGet(store, transferId);
  assertForward(t.status, "Cancelled");
  t.status = "Cancelled";
  return t;
}

/**
 * Called by the provider-completion path only. Marks Completed exclusively
 * when the provider adapter reports the payment completed; also posts the
 * double-entry for the movement of funds.
 */
export function markProviderCompleted(
  store: InMemoryStore,
  transferId: string,
): Transfer {
  const t = mustGet(store, transferId);
  assertForward(t.status, "Completed");
  const beneficiary = store.beneficiaries.get(t.beneficiaryId);
  const feeAccount = store.accounts.get("acct_fees") ?? null;
  const entries: import("./ledger").PostingEntry[] = [
    {
      accountId: t.sourceAccountId,
      direction: "debit" as const,
      amountMinor: t.amountMinor,
      currency: t.currency,
    },
  ];
  if (feeAccount && t.feeMinor > 0) {
    entries.push(
      {
        accountId: "acct_outbound",
        direction: "credit" as const,
        amountMinor: t.amountMinor - t.feeMinor,
        currency: t.currency,
      },
      {
        accountId: feeAccount.id,
        direction: "credit" as const,
        amountMinor: t.feeMinor,
        currency: t.currency,
      },
    );
  } else {
    entries.push({
      accountId: "acct_outbound",
      direction: "credit" as const,
      amountMinor: t.amountMinor,
      currency: t.currency,
    });
  }
  const tx = postTransaction(store, {
    description: `Transfer to ${beneficiary?.name ?? "beneficiary"}`,
    reference: t.reference,
    source: "transfer",
    entries,
    authorization: { approvedBy: t.approvals },
  });
  t.transactionId = tx.id;
  t.status = "Completed";
  return t;
}

export function rejectTransfer(
  store: InMemoryStore,
  transferId: string,
): Transfer {
  const t = mustGet(store, transferId);
  assertForward(t.status, "Rejected");
  t.status = "Rejected";
  return t;
}

export function markFailed(store: InMemoryStore, transferId: string): Transfer {
  const t = mustGet(store, transferId);
  assertForward(t.status, "Failed");
  t.status = "Failed";
  return t;
}

export function insufficientFunds(
  store: InMemoryStore,
  transfer: Transfer,
): boolean {
  return balanceFor(store, transfer.sourceAccountId) < transfer.amountMinor;
}

function mustGet(store: InMemoryStore, id: string): Transfer {
  const t = store.transfers.get(id);
  if (!t) throw new Error(`Unknown transfer ${id}`);
  return t;
}
