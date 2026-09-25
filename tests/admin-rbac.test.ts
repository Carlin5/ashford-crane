import { beforeEach, describe, expect, it } from "vitest";
import {
  approveTransfer,
  createTransfer,
  submitTransfer,
} from "@/server/domain/transfers";
import { postTransaction, balanceFor } from "@/server/domain/ledger";
import { can, DualControlError } from "@/server/domain/rbac";
import { maskEmail, maskKycData, maskPhone } from "@/server/pii-masking";
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
    providerHealth: {}, jurisdictions: [], counters: new Map(),
  };
  store.accounts.set("src", { id: "src", customerId: "c", name: "S", currency: "USD", identifier: "s", status: "active" });
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

describe("dual control", () => {
  it("rejects the same staff user approving twice", () => {
    const t = createTransfer(store, {
      customerId: "c", createdBy: "u", sourceAccountId: "src",
      beneficiaryId: "ben", currency: "USD", amountMinor: 10_000,
      feeMinor: 500, requiresApproval: true,
    });
    submitTransfer(store, t.id);
    const ops = { userId: "ops1", role: "operations_officer" as const };
    approveTransfer(store, t.id, ops);
    expect(t.approvals).toHaveLength(1);
    expect(() => approveTransfer(store, t.id, ops)).toThrow(DualControlError);
    expect(t.status).toBe("PendingVerification");
  });

  it("relationship managers can never approve transfers", () => {
    expect(can("relationship_manager", "approve_transfers")).toBe(false);
    const t = createTransfer(store, {
      customerId: "c", createdBy: "u", sourceAccountId: "src",
      beneficiaryId: "ben", currency: "USD", amountMinor: 10_000,
      feeMinor: 500, requiresApproval: true,
    });
    submitTransfer(store, t.id);
    expect(() =>
      approveTransfer(store, t.id, { userId: "rm1", role: "relationship_manager" }),
    ).toThrow(DualControlError);
  });
});

describe("PII masking", () => {
  it("masks email keeping the domain", () => {
    expect(maskEmail("amara@demo.ashfordcrane.test")).toBe("a***@demo.ashfordcrane.test");
  });
  it("masks phone keeping last two digits", () => {
    expect(maskPhone("+256772123456")).toBe("***56");
  });
  it("masks email/phone/dob fields in KYC data but keeps the rest", () => {
    const masked = maskKycData(
      { email: "a@b.test", phone: "12345", dob: "1980-01-01", residence: "Uganda" },
      true,
    );
    expect(masked.email).toBe("a***@b.test");
    expect(masked.phone).toBe("***45");
    expect(masked.dob).toBe("***");
    expect(masked.residence).toBe("Uganda");
  });
});

describe("card purchase postings", () => {
  it("posts as a debit on the client account", () => {
    const before = balanceFor(store, "src");
    const tx = postTransaction(store, {
      description: "Card purchase — test merchant",
      reference: "CARD-1",
      source: "card",
      entries: [
        { accountId: "src", direction: "debit", amountMinor: 4_500, currency: "USD" },
        { accountId: "equity", direction: "credit", amountMinor: 4_500, currency: "USD" },
      ],
    });
    const entry = [...store.entries.values()].find(
      (e) => e.transactionId === tx.id && e.accountId === "src",
    )!;
    expect(entry.direction).toBe("debit");
    expect(balanceFor(store, "src")).toBe(before - 4_500);
  });
});
