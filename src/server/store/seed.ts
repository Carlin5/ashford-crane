import { createHash } from "crypto";
import type { Currency } from "@/lib/money";
import { getStore, nextId, type InMemoryStore } from "./index";
import { postTransaction } from "../domain/ledger";
import { issueCard } from "../domain/cards";
import { createTransfer, submitTransfer, authorizeTransfer } from "../domain/transfers";
import { createApplication, transition } from "../domain/kyc";
import { raiseAlert, openCase } from "../domain/compliance";
import { audit } from "../domain/audit";
import type { User } from "../types";

function hash(pw: string): string {
  return createHash("sha256").update(`ac-sandbox:${pw}`).digest("hex");
}

export function seedPassword(): string {
  return "demo-sandbox";
}

let seeded = false;

/** Deterministic demo data; idempotent per store instance. */
export function ensureSeed(store: InMemoryStore = getStore()): void {
  if (seeded || store.users.size > 0) {
    seeded = true;
    return;
  }
  seeded = true;
  const pw = hash(seedPassword());

  const users: Omit<User, "id">[] = [
    { email: "client.private@demo.ashfordcrane.test", name: "Amara Okello", role: "client", passwordHash: pw, customerId: "cust_private" },
    { email: "client.corporate@demo.ashfordcrane.test", name: "Daniel Semakula", role: "client", passwordHash: pw, customerId: "cust_corporate" },
    { email: "client.corporate2@demo.ashfordcrane.test", name: "Lydia Nansubuga", role: "client", passwordHash: pw, customerId: "cust_corporate" },
    { email: "admin@demo.ashfordcrane.test", name: "Admin User", role: "super_admin", passwordHash: pw },
    { email: "compliance@demo.ashfordcrane.test", name: "Compliance Officer", role: "compliance_officer", passwordHash: pw },
    { email: "ops@demo.ashfordcrane.test", name: "Operations One", role: "operations_officer", passwordHash: pw },
    { email: "ops2@demo.ashfordcrane.test", name: "Operations Two", role: "operations_officer", passwordHash: pw },
    { email: "support@demo.ashfordcrane.test", name: "Support Agent", role: "customer_support", passwordHash: pw },
    { email: "rm@demo.ashfordcrane.test", name: "Relationship Manager", role: "relationship_manager", passwordHash: pw, assignedCustomerIds: ["cust_private", "cust_corporate"] },
    { email: "finance@demo.ashfordcrane.test", name: "Finance Officer", role: "finance_officer", passwordHash: pw },
    { email: "risk@demo.ashfordcrane.test", name: "Risk Officer", role: "risk_officer", passwordHash: pw },
  ];
  for (const u of users) {
    store.users.set(u.email, { id: nextId(store, "user"), ...u });
  }

  store.customers.set("cust_private", { id: "cust_private", kind: "individual", name: "Amara Okello", tier: "private_plus", riskRating: "low" });
  store.customers.set("cust_corporate", { id: "cust_corporate", kind: "business", name: "Halcyon Trading Ltd", tier: "corporate", riskRating: "medium" });

  // Platform clearing accounts
  store.accounts.set("acct_outbound", { id: "acct_outbound", customerId: "platform", name: "Outbound clearing", currency: "USD", identifier: "AC-OUT-000", status: "active" });
  store.accounts.set("acct_fees", { id: "acct_fees", customerId: "platform", name: "Fee income", currency: "USD", identifier: "AC-FEE-000", status: "active" });

  const accountSeeds: [string, string, Currency, string, number][] = [
    ["acct_usd_p", "cust_private", "USD", "AC-USD-1001", 4825012],
    ["acct_eur_p", "cust_private", "EUR", "AC-EUR-1002", 2103500],
    ["acct_gbp_p", "cust_private", "GBP", "AC-GBP-1003", 987650],
    ["acct_ugx_p", "cust_private", "UGX", "AC-UGX-1004", 158_000_000],
    ["acct_kes_p", "cust_private", "KES", "AC-KES-1005", 4_203_400],
    ["acct_aed_p", "cust_private", "AED", "AC-AED-1006", 705_500],
    ["acct_usd_c", "cust_corporate", "USD", "AC-USD-2001", 1_250_000],
    ["acct_aed_c", "cust_corporate", "AED", "AC-AED-2002", 890_200],
  ];
  for (const [id, cust, cur, ident, bal] of accountSeeds) {
    store.accounts.set(id, { id, customerId: cust, name: `${cur} account`, currency: cur, identifier: ident, status: "active" });
    // Opening balance posted as a balanced seed transaction vs a system equity account
    const equityId = `acct_equity_${cur.toLowerCase()}`;
    if (!store.accounts.has(equityId)) {
      store.accounts.set(equityId, { id: equityId, customerId: "platform", name: `${cur} equity`, currency: cur, identifier: `AC-EQ-${cur}`, status: "active" });
    }
    postTransaction(store, {
      description: "Opening balance (demo data)",
      reference: `SEED-${id}`,
      source: "seed",
      entries: [
        { accountId: equityId, direction: "debit", amountMinor: bal, currency: cur },
        { accountId: id, direction: "credit", amountMinor: bal, currency: cur },
      ],
    });
  }

  // ~60 fictional transactions across private accounts
  const descs = [
    "Card purchase — market", "Transfer received", "Utility payment",
    "Card purchase — fuel", "Subscription", "Invoice settlement",
    "FX conversion", "ATM withdrawal", "Service fee", "Refund",
  ];
  const acctIds = accountSeeds.filter(([, c]) => c === "cust_private").map(([id]) => id);
  const equityFor = (cur: Currency) => `acct_equity_${cur.toLowerCase()}`;
  const acctCur = new Map(accountSeeds.map(([id, , cur]) => [id, cur]));
  for (let i = 0; i < 60; i++) {
    const acctId = acctIds[i % acctIds.length];
    const cur = acctCur.get(acctId)!;
    const amt = ((i * 37) % 900 + 50) * (cur === "UGX" ? 1000 : cur === "KES" ? 20 : 1);
    const incoming = i % 3 === 0;
    postTransaction(store, {
      description: `${descs[i % descs.length]} — demo`,
      reference: `DEMO-TXN-${String(i + 1).padStart(4, "0")}`,
      source: i % 4 === 0 ? "card" : "seed",
      entries: [
        { accountId: acctId, direction: incoming ? "credit" : "debit", amountMinor: amt, currency: cur },
        { accountId: equityFor(cur), direction: incoming ? "debit" : "credit", amountMinor: amt, currency: cur },
      ],
    });
  }

  // Beneficiaries
  const bens: [string, string, string, Currency, string][] = [
    ["ben_1", "Nakato Estates Ltd", "UG-AC-88412", "UGX", "Kampala City Bank"],
    ["ben_2", "Okafor & Sons Trading", "NG-AC-55210", "USD", "Lagos Commercial Bank"],
    ["ben_3", "Al-Rashid Logistics FZE", "AE-AC-77401", "AED", "Gulf Partner Bank"],
  ];
  for (const [id, name, ident, cur, bank] of bens) {
    store.beneficiaries.set(id, { id, customerId: "cust_private", name, accountIdentifier: ident, currency: cur, bankName: bank });
  }

  // Cards
  issueCard(store, { customerId: "cust_private", accountId: "acct_usd_p", label: "Ashford Private Card", last4: "4417", token: "tok_demo_4417", expiry: "09/28", limitMinor: 500_000 });
  issueCard(store, { customerId: "cust_private", accountId: "acct_aed_p", label: "Ashford Private Card (AED)", last4: "9082", token: "tok_demo_9082", expiry: "01/27", limitMinor: 200_000 });

  // Transfers in different statuses
  const t1 = createTransfer(store, {
    customerId: "cust_private", createdBy: "seed",
    sourceAccountId: "acct_usd_p", beneficiaryId: "ben_2",
    currency: "USD", amountMinor: 50_000, feeMinor: 1_750,
    recipientAmountMinor: 48_250, recipientCurrency: "USD", fxRate: 1,
  });
  submitTransfer(store, t1.id);
  authorizeTransfer(store, t1.id);
  t1.submittedAt = Date.now() - 60_000; // will report completed on next read
  const t2 = createTransfer(store, {
    customerId: "cust_private", createdBy: "seed",
    sourceAccountId: "acct_eur_p", beneficiaryId: "ben_1",
    currency: "EUR", amountMinor: 120_000, feeMinor: 2_100,
  });
  submitTransfer(store, t2.id);

  // KYC application under review
  const app = createApplication(store, {
    kind: "individual", applicantEmail: "client.private@demo.ashfordcrane.test",
    data: { fullName: "Amara Okello", nationality: "Ugandan", residence: "Uganda" },
  });
  transition(store, app.id, "DocumentsRequired");
  transition(store, app.id, "UnderReview", "system");

  // Compliance alerts + a case
  raiseAlert(store, { customerId: "cust_private", kind: "unusual_amount", detail: "Outgoing amount above profile baseline — demo" });
  raiseAlert(store, { customerId: "cust_corporate", kind: "geographic", detail: "Activity from a new jurisdiction — demo" });
  openCase(store, { customerId: "cust_private", openedBy: { userId: "system", role: "compliance_officer" } });

  audit(store, { actorId: "system", actorRole: "super_admin", action: "seed", target: "store", detail: "Deterministic demo data seeded" });

  // Sample notifications + a thread + sessions/devices
  const privateUser = store.users.get("client.private@demo.ashfordcrane.test")!;
  store.notifications.set("ntf_1", { id: "ntf_1", userId: privateUser.id, kind: "kyc", text: "Your application is under review.", read: false, createdAt: Date.now() - 3600_000 });
  store.threads.set("thr_1", { id: "thr_1", customerId: "cust_private", subject: "Question about transfer limits", messages: [{ from: "client", text: "What daily limits apply to international transfers?", at: Date.now() - 7200_000 }, { from: "staff", text: "Limits depend on your tier and corridor; we will confirm exact figures for your account.", at: Date.now() - 3600_000 }] });
  store.sessions.set("ses_seed1", { id: "ses_seed1", userId: privateUser.id, deviceLabel: "MacBook Pro — Safari", ip: "192.0.2.14", createdAt: Date.now() - 86_400_000 });
  store.devices.set("dev_1", { id: "dev_1", userId: privateUser.id, label: "MacBook Pro — Safari", lastSeenAt: Date.now() - 3600_000 });
  store.devices.set("dev_2", { id: "dev_2", userId: privateUser.id, label: "iPhone 15 — Chrome", lastSeenAt: Date.now() - 86_400_000 });
}
