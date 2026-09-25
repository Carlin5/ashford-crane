import { beforeEach, describe, expect, it } from "vitest";
import {
  balanceFor,
  LedgerImbalanceError,
  postTransaction,
  reversal,
} from "@/server/domain/ledger";
import type { InMemoryStore } from "@/server/store";

function freshStore(): InMemoryStore {
  const store: InMemoryStore = {
    users: new Map(), customers: new Map(), accounts: new Map(),
    transactions: new Map(), entries: new Map(), beneficiaries: new Map(),
    transfers: new Map(), cards: new Map(), kycApplications: new Map(),
    alerts: new Map(), cases: new Map(), tickets: new Map(),
    threads: new Map(), notifications: new Map(), sessions: new Map(),
    devices: new Map(), auditLog: new Map(), idempotency: new Map(),
    providerHealth: {}, counters: new Map(),
  };
  store.accounts.set("a", { id: "a", customerId: "c", name: "A", currency: "USD", identifier: "a", status: "active" });
  store.accounts.set("b", { id: "b", customerId: "c", name: "B", currency: "USD", identifier: "b", status: "active" });
  return store;
}

let store: InMemoryStore;
beforeEach(() => {
  store = freshStore();
});

function fund(accountId: string, amount: number) {
  store.accounts.set("equity", { id: "equity", customerId: "platform", name: "Eq", currency: "USD", identifier: "e", status: "active" });
  postTransaction(store, {
    description: "fund", reference: "F1", source: "seed",
    entries: [
      { accountId: "equity", direction: "debit", amountMinor: amount, currency: "USD" },
      { accountId, direction: "credit", amountMinor: amount, currency: "USD" },
    ],
  });
}

describe("double-entry ledger", () => {
  it("rejects an unbalanced posting and writes nothing", () => {
    fund("a", 1000);
    const before = store.entries.size;
    expect(() =>
      postTransaction(store, {
        description: "bad", reference: "X", source: "adjustment",
        entries: [
          { accountId: "a", direction: "debit", amountMinor: 500, currency: "USD" },
          { accountId: "b", direction: "credit", amountMinor: 400, currency: "USD" },
        ],
      }),
    ).toThrow(LedgerImbalanceError);
    expect(store.entries.size).toBe(before); // atomic: all-or-nothing
  });

  it("rejects mixed-currency imbalance per currency", () => {
    fund("a", 1000);
    expect(() =>
      postTransaction(store, {
        description: "bad", reference: "X", source: "adjustment",
        entries: [
          { accountId: "a", direction: "debit", amountMinor: 500, currency: "USD" },
          { accountId: "b", direction: "credit", amountMinor: 500, currency: "EUR" },
        ],
      }),
    ).toThrow(LedgerImbalanceError);
  });

  it("prevents overdrawing an account", () => {
    fund("a", 100);
    expect(() =>
      postTransaction(store, {
        description: "overdraft", reference: "X", source: "adjustment",
        entries: [
          { accountId: "a", direction: "debit", amountMinor: 200, currency: "USD" },
          { accountId: "b", direction: "credit", amountMinor: 200, currency: "USD" },
        ],
      }),
    ).toThrow(/Insufficient/);
  });

  it("posts balanced entries and computes balances", () => {
    fund("a", 1000);
    postTransaction(store, {
      description: "move", reference: "M1", source: "transfer",
      entries: [
        { accountId: "a", direction: "debit", amountMinor: 300, currency: "USD" },
        { accountId: "b", direction: "credit", amountMinor: 300, currency: "USD" },
      ],
    });
    expect(balanceFor(store, "a")).toBe(700);
    expect(balanceFor(store, "b")).toBe(300);
  });

  it("reversal creates new offsetting entries without mutating history", () => {
    fund("a", 1000);
    const tx = postTransaction(store, {
      description: "move", reference: "M1", source: "transfer",
      entries: [
        { accountId: "a", direction: "debit", amountMinor: 300, currency: "USD" },
        { accountId: "b", direction: "credit", amountMinor: 300, currency: "USD" },
      ],
    });
    const originalEntries = [...store.entries.values()].filter(
      (e) => e.transactionId === tx.id,
    ).length;
    const rev = reversal(store, tx.id, "duplicate");
    expect(store.transactions.get(tx.id)!.status).toBe("reversed");
    expect(balanceFor(store, "a")).toBe(1000); // net effect undone
    // history intact: original entries still present plus new reversal entries
    expect([...store.entries.values()].filter((e) => e.transactionId === tx.id)).toHaveLength(originalEntries);
    expect(rev.id).not.toBe(tx.id);
    expect(() => reversal(store, tx.id, "again")).toThrow(/already reversed/);
  });
});
