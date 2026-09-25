import type { Currency } from "@/lib/money";
import { nextId, type InMemoryStore } from "../store";
import type {
  Direction,
  Transaction,
  TransactionEntry,
} from "../types";

export class LedgerImbalanceError extends Error {
  constructor(currency: string) {
    super(`Ledger posting is unbalanced for ${currency}`);
    this.name = "LedgerImbalanceError";
  }
}

export type PostingEntry = {
  accountId: string;
  direction: Direction;
  amountMinor: number;
  currency: Currency;
};

export type PostingInput = {
  description: string;
  reference: string;
  source: Transaction["source"];
  entries: PostingEntry[];
  authorization?: { approvedBy: string[] };
};

/**
 * Double-entry posting: per-currency sum(debit) must equal sum(credit) or the
 * whole posting fails atomically — nothing is written. Accounts are not
 * allowed to go negative in the sandbox (available-balance enforcement).
 */
export function postTransaction(
  store: InMemoryStore,
  input: PostingInput,
): Transaction {
  if (input.entries.length < 2) {
    throw new LedgerImbalanceError("posting requires at least two entries");
  }
  const sums = new Map<Currency, { debit: number; credit: number }>();
  for (const e of input.entries) {
    if (e.amountMinor <= 0 || !Number.isInteger(e.amountMinor)) {
      throw new Error("amountMinor must be a positive integer");
    }
    const s = sums.get(e.currency) ?? { debit: 0, credit: 0 };
    s[e.direction] += e.amountMinor;
    sums.set(e.currency, s);
  }
  for (const [currency, s] of sums) {
    if (s.debit !== s.credit) throw new LedgerImbalanceError(currency);
  }
  // Available-balance enforcement: a debit must not overdraw the account.
  for (const e of input.entries) {
    if (e.direction === "debit") {
      const account = store.accounts.get(e.accountId);
      if (!account) throw new Error(`Unknown account ${e.accountId}`);
      // Platform clearing/equity accounts may run negative by design.
      if (account.customerId === "platform") continue;
      const debits = input.entries
        .filter(
          (x) => x.accountId === e.accountId && x.direction === "debit",
        )
        .reduce((n, x) => n + x.amountMinor, 0);
      if (balanceFor(store, e.accountId) - debits < 0) {
        throw new Error("Insufficient available balance");
      }
    }
  }

  // Validated — now commit atomically.
  const tx: Transaction = {
    id: nextId(store, "txn"),
    description: input.description,
    reference: input.reference,
    status: "posted",
    source: input.source,
    createdAt: Date.now(),
    authorization: input.authorization,
  };
  const entries: TransactionEntry[] = input.entries.map((e) => ({
    id: nextId(store, "entry"),
    transactionId: tx.id,
    ...e,
  }));
  store.transactions.set(tx.id, tx);
  for (const e of entries) store.entries.set(e.id, e);
  return tx;
}

/** Ledger balance for an account: sum(credits) - sum(debits). */
export function balanceFor(store: InMemoryStore, accountId: string): number {
  let bal = 0;
  for (const e of store.entries.values()) {
    if (e.accountId !== accountId) continue;
    // Reversed transactions still count: the reversal's own offsetting
    // entries are what undo them — history is never edited.
    bal += e.direction === "credit" ? e.amountMinor : -e.amountMinor;
  }
  return bal;
}

export function entriesForAccount(
  store: InMemoryStore,
  accountId: string,
): (TransactionEntry & { transaction: Transaction })[] {
  const out: (TransactionEntry & { transaction: Transaction })[] = [];
  for (const e of store.entries.values()) {
    if (e.accountId !== accountId) continue;
    const tx = store.transactions.get(e.transactionId);
    if (tx) out.push({ ...e, transaction: tx });
  }
  return out.sort((a, b) => b.transaction.createdAt - a.transaction.createdAt);
}

/**
 * Corrections are always a new, properly recorded reversal entry — history
 * is never edited. The original transaction is marked reversed.
 */
export function reversal(
  store: InMemoryStore,
  transactionId: string,
  reason: string,
): Transaction {
  const original = store.transactions.get(transactionId);
  if (!original) throw new Error(`Unknown transaction ${transactionId}`);
  if (original.status === "reversed") {
    throw new Error("Transaction already reversed");
  }
  const originalEntries = [...store.entries.values()].filter(
    (e) => e.transactionId === transactionId,
  );
  const reversed = postTransaction(store, {
    description: `Reversal of ${original.reference}: ${reason}`,
    reference: `${original.reference}-REV`,
    source: "adjustment",
    entries: originalEntries.map((e) => ({
      accountId: e.accountId,
      direction: e.direction === "debit" ? "credit" : "debit",
      amountMinor: e.amountMinor,
      currency: e.currency,
    })),
  });
  original.status = "reversed";
  return reversed;
}
