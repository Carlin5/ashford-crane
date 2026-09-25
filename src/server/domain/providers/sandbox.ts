import type { Currency } from "@/lib/money";
import type { InMemoryStore } from "../../store";
import {
  ProviderUnavailableError,
  type BankingProvider,
  type CardIssuer,
  type FxProvider,
  type KycProvider,
  type ScreeningProvider,
} from "./interfaces";

function healthy(store: InMemoryStore, provider: string): void {
  if (store.providerHealth[provider] === "down") {
    throw new ProviderUnavailableError(provider);
  }
}

/** Deterministic mid-market rates (units of `to` per 1 `from`). */
const BASE_RATES: Record<string, number> = {
  "USD:EUR": 0.92, "USD:GBP": 0.79, "USD:UGX": 3720, "USD:KES": 129.4, "USD:AED": 3.6725,
  "EUR:USD": 1.087, "EUR:GBP": 0.855, "EUR:UGX": 4045, "EUR:KES": 140.6, "EUR:AED": 3.992,
  "GBP:USD": 1.272, "GBP:EUR": 1.17, "GBP:UGX": 4732, "GBP:KES": 164.5, "GBP:AED": 4.671,
  "UGX:USD": 0.000269, "KES:USD": 0.00773, "AED:USD": 0.2723,
};

function midRate(from: Currency, to: Currency): number {
  if (from === to) return 1;
  const direct = BASE_RATES[`${from}:${to}`];
  if (direct) return direct;
  const viaUsd = BASE_RATES[`${from}:USD`];
  const usdTo = BASE_RATES[`USD:${to}`];
  if (viaUsd && usdTo) return viaUsd * usdTo;
  const inverse = BASE_RATES[`${to}:${from}`];
  if (inverse) return 1 / inverse;
  return 1;
}

export class SandboxFxProvider implements FxProvider {
  constructor(private store: InMemoryStore) {}
  async getRate(from: Currency, to: Currency): Promise<number> {
    healthy(this.store, "fx");
    // Deterministic gentle drift per 8s bucket so the ticker visibly re-tweens.
    const bucket = Math.floor(Date.now() / 8000);
    const wobble = ((bucket * 2654435761) % 1000) / 1000 - 0.5; // [-0.5, 0.5)
    return midRate(from, to) * (1 + wobble * 0.001);
  }
}

export class SandboxBankingProvider implements BankingProvider {
  constructor(private store: InMemoryStore) {}
  async reportTransferStatus(transferId: string): Promise<"completed" | "failed" | "processing"> {
    healthy(this.store, "banking");
    const t = this.store.transfers.get(transferId);
    if (!t || !t.submittedAt) return "processing";
    // Deterministic async: reported completed ~10s after submission.
    return Date.now() - t.submittedAt >= 10_000 ? "completed" : "processing";
  }
  async getBalance(accountId: string): Promise<number> {
    healthy(this.store, "banking");
    const { balanceFor } = await import("../ledger");
    return balanceFor(this.store, accountId);
  }
}

export class SandboxCardIssuer implements CardIssuer {
  constructor(private store: InMemoryStore) {}
  async setFrozen(cardToken: string, frozen: boolean): Promise<void> {
    void cardToken; void frozen;
    healthy(this.store, "cardIssuer");
  }
  async setLimit(cardToken: string, limitMinor: number): Promise<void> {
    void cardToken; void limitMinor;
    healthy(this.store, "cardIssuer");
  }
}

export class SandboxKycProvider implements KycProvider {
  constructor(private store: InMemoryStore) {}
  async submitApplication(applicationId: string): Promise<{ reference: string }> {
    healthy(this.store, "kyc");
    return { reference: `KYC-${applicationId.slice(-6)}` };
  }
}

export class SandboxScreeningProvider implements ScreeningProvider {
  constructor(private store: InMemoryStore) {}
  async screen(): Promise<{ hits: number }> {
    healthy(this.store, "screening");
    return { hits: 0 }; // sandbox: no matches
  }
}

export function makeProviders(store: InMemoryStore) {
  return {
    banking: new SandboxBankingProvider(store),
    cardIssuer: new SandboxCardIssuer(store),
    fx: new SandboxFxProvider(store),
    kyc: new SandboxKycProvider(store),
    screening: new SandboxScreeningProvider(store),
  };
}
