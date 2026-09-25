import { beforeEach, describe, expect, it } from "vitest";
import {
  approveTransfer,
  authorizeTransfer,
  cancelTransfer,
  createTransfer,
  markProviderCompleted,
  submitTransfer,
} from "@/server/domain/transfers";
import { postTransaction } from "@/server/domain/ledger";
import { DualControlError } from "@/server/domain/rbac";
import type { InMemoryStore } from "@/server/store";

let store: InMemoryStore;
beforeEach(() => {
  store = {
    users: new Map(), customers: new Map(), accounts: new Map(),
    transactions: new Map(), entries: new Map(), beneficiaries: new Map(),
    transfers: new Map(), cards: new Map(), kycApplications: new Map(),
    alerts: new Map(), cases: new Map(), tickets: new Map(),
    threads: new Map(), notifications: new Map(), sessions: new Map(),
    devices: new Map(), auditLog: new Map(), idempotency: new Map(),
    providerHealth: {}, counters: new Map(),
  };
  store.accounts.set("src", { id: "src", customerId: "c", name: "S", currency: "USD", identifier: "s", status: "active" });
  store.accounts.set("acct_outbound", { id: "acct_outbound", customerId: "platform", name: "O", currency: "USD", identifier: "o", status: "active" });
  store.accounts.set("acct_fees", { id: "acct_fees", customerId: "platform", name: "F", currency: "USD", identifier: "f", status: "active" });
  store.accounts.set("equity", { id: "equity", customerId: "platform", name: "E", currency: "USD", identifier: "e", status: "active" });
  postTransaction(store, {
    description: "fund", reference: "F", source: "seed",
    entries: [
      { accountId: "equity", direction: "debit", amountMinor: 1_000_000, currency: "USD" },
      { accountId: "src", direction: "credit", amountMinor: 1_000_000, currency: "USD" },
    ],
  });
  store.beneficiaries.set("ben", { id: "ben", customerId: "c", name: "B", accountIdentifier: "x", currency: "USD", bankName: "Bank" });
});

function draft(requiresApproval = false) {
  return createTransfer(store, {
    customerId: "c", createdBy: "u", sourceAccountId: "src",
    beneficiaryId: "ben", currency: "USD", amountMinor: 10_000,
    feeMinor: 500, requiresApproval,
  });
}

describe("transfer state machine", () => {
  it("moves forward Draft → PendingVerification → Processing → Completed", () => {
    const t = draft();
    submitTransfer(store, t.id);
    expect(t.status).toBe("PendingVerification");
    authorizeTransfer(store, t.id);
    expect(t.status).toBe("Processing");
    markProviderCompleted(store, t.id);
    expect(t.status).toBe("Completed");
    expect(store.transactions.get(t.transactionId!)).toBeTruthy();
  });

  it("never moves backwards", () => {
    const t = draft();
    submitTransfer(store, t.id);
    expect(() => authorizeTransfer(store, t.id)).not.toThrow();
    expect(() => submitTransfer(store, t.id)).toThrow(/cannot move/i);
    expect(() => cancelTransfer(store, t.id)).toThrow(/cannot move/i);
    markProviderCompleted(store, t.id);
    expect(() => cancelTransfer(store, t.id)).toThrow();
  });

  it("requires two distinct staff authorizers for corporate transfers", () => {
    const t = draft(true);
    submitTransfer(store, t.id);
    approveTransfer(store, t.id, { userId: "ops1", role: "operations_officer" });
    expect(t.status).toBe("PendingVerification"); // still 1 of 2
    approveTransfer(store, t.id, { userId: "ops2", role: "finance_officer" });
    expect(t.approvals).toHaveLength(2);
    expect(t.status).toBe("Processing");
  });

  it("rejects the same authorizer twice", () => {
    const t = draft(true);
    submitTransfer(store, t.id);
    approveTransfer(store, t.id, { userId: "ops1", role: "operations_officer" });
    expect(() =>
      authorizeTransfer(store, t.id),
    ).toThrow(/two authorizations/);
  });

  it("dual control helper rejects non-authorizer roles", () => {
    expect(() =>
      approveTransfer(store, draft(true).id, { userId: "x", role: "customer_support" }),
    ).toThrow(/cannot authorize fund movements/);
  });
});

describe("dual control", () => {
  it("assertDualControl throws for same user or unauthorized role", async () => {
    const { assertDualControl } = await import("@/server/domain/rbac");
    expect(() =>
      assertDualControl(
        { userId: "a", role: "operations_officer" },
        { userId: "a", role: "operations_officer" },
      ),
    ).toThrow(DualControlError);
    expect(() =>
      assertDualControl(
        { userId: "a", role: "operations_officer" },
        { userId: "b", role: "customer_support" },
      ),
    ).toThrow(DualControlError);
  });
});
