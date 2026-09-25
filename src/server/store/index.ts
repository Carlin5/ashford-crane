import type {
  Account,
  AuditEntry,
  Beneficiary,
  Card,
  ComplianceAlert,
  ComplianceCase,
  Customer,
  Device,
  IdempotencyRecord,
  KycApplication,
  MessageThread,
  Notification,
  ProviderHealthMap,
  SessionRecord,
  SupportTicket,
  Transaction,
  TransactionEntry,
  Transfer,
  User,
} from "../types";

/** Simulated data latency so loading/skeleton states are exercised. */
export function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type InMemoryStore = {
  users: Map<string, User>;
  customers: Map<string, Customer>;
  accounts: Map<string, Account>;
  transactions: Map<string, Transaction>;
  entries: Map<string, TransactionEntry>;
  beneficiaries: Map<string, Beneficiary>;
  transfers: Map<string, Transfer>;
  cards: Map<string, Card>;
  kycApplications: Map<string, KycApplication>;
  alerts: Map<string, ComplianceAlert>;
  cases: Map<string, ComplianceCase>;
  tickets: Map<string, SupportTicket>;
  threads: Map<string, MessageThread>;
  notifications: Map<string, Notification>;
  sessions: Map<string, SessionRecord>;
  devices: Map<string, Device>;
  auditLog: Map<string, AuditEntry>;
  idempotency: Map<string, IdempotencyRecord>;
  providerHealth: ProviderHealthMap;
  counters: Map<string, number>;
};

export function nextId(store: InMemoryStore, prefix: string): string {
  const n = (store.counters.get(prefix) ?? 0) + 1;
  store.counters.set(prefix, n);
  return `${prefix}_${String(n).padStart(6, "0")}`;
}

const KEY = "__ac_store__";

export function getStore(): InMemoryStore {
  const g = globalThis as typeof globalThis & { [KEY]?: InMemoryStore };
  if (!g[KEY]) {
    g[KEY] = {
      users: new Map(),
      customers: new Map(),
      accounts: new Map(),
      transactions: new Map(),
      entries: new Map(),
      beneficiaries: new Map(),
      transfers: new Map(),
      cards: new Map(),
      kycApplications: new Map(),
      alerts: new Map(),
      cases: new Map(),
      tickets: new Map(),
      threads: new Map(),
      notifications: new Map(),
      sessions: new Map(),
      devices: new Map(),
      auditLog: new Map(),
      idempotency: new Map(),
      providerHealth: {
        banking: "up",
        cardIssuer: "up",
        fx: "up",
        kyc: "up",
        screening: "up",
      },
      counters: new Map(),
    };
  }
  return g[KEY]!;
}
