import { describe, expect, it } from "vitest";
import { can } from "@/server/domain/rbac";
import { quoteTransfer } from "@/server/domain/fees";
import { createApplication, transition } from "@/server/domain/kyc";
import type { InMemoryStore } from "@/server/store";

describe("rbac matrix", () => {
  it("customer support sees masked profiles only and cannot move funds", () => {
    expect(can("customer_support", "view_customer_profiles_masked")).toBe(true);
    expect(can("customer_support", "view_customer_profiles")).toBe(false);
    expect(can("customer_support", "approve_transfers")).toBe(false);
  });
  it("operations and finance can approve transfers; compliance cannot", () => {
    expect(can("operations_officer", "approve_transfers")).toBe(true);
    expect(can("finance_officer", "approve_transfers")).toBe(true);
    expect(can("compliance_officer", "approve_transfers")).toBe(false);
  });
  it("compliance manages cases; risk can only escalate", () => {
    expect(can("compliance_officer", "manage_cases")).toBe(true);
    expect(can("risk_officer", "manage_cases")).toBe(false);
    expect(can("risk_officer", "escalate_cases")).toBe(true);
  });
  it("only super admin manages users", () => {
    expect(can("super_admin", "manage_users")).toBe(true);
    expect(can("operations_officer", "manage_users")).toBe(false);
  });
});

describe("fee quoting", () => {
  it("computes flat + percentage fee from config", () => {
    const q = quoteTransfer({ amountMinor: 100_000, from: "USD", to: "EUR", referenceRate: 0.92 });
    expect(q.feeMinor).toBe(1500 + Math.round(100_000 * 50 / 10_000)); // 1500 + 500
    expect(q.recipientAmountMinor).toBe(Math.round((100_000 - q.feeMinor) * q.fxRate));
    expect(q.referenceRateSource).toContain("pending");
  });
  it("applies the configured FX spread", () => {
    const q = quoteTransfer({ amountMinor: 10_000, from: "USD", to: "USD", referenceRate: 1 });
    expect(q.fxRate).toBeCloseTo(1 - 80 / 10_000, 5);
  });
});

describe("kyc state machine", () => {
  function store(): InMemoryStore {
    return {
      users: new Map(), customers: new Map(), accounts: new Map(),
      transactions: new Map(), entries: new Map(), beneficiaries: new Map(),
      transfers: new Map(), cards: new Map(), kycApplications: new Map(),
      alerts: new Map(), cases: new Map(), tickets: new Map(),
      threads: new Map(), notifications: new Map(), sessions: new Map(),
      devices: new Map(), auditLog: new Map(), idempotency: new Map(),
      providerHealth: {}, jurisdictions: [], counters: new Map(),
    };
  }
  it("never auto-approves — approval requires a reviewer action", () => {
    const s = store();
    const app = createApplication(s, { kind: "individual", applicantEmail: "x@y.z", data: {} });
    transition(s, app.id, "DocumentsRequired");
    transition(s, app.id, "UnderReview", "rev1");
    expect(() => transition(s, app.id, "Approved")).toThrow(/reviewer/);
    transition(s, app.id, "Approved", "rev1");
    expect(app.status).toBe("Approved");
  });
  it("rejects invalid transitions", () => {
    const s = store();
    const app = createApplication(s, { kind: "individual", applicantEmail: "x@y.z", data: {} });
    expect(() => transition(s, app.id, "Approved", "rev1")).toThrow(/Cannot move/);
  });
});
