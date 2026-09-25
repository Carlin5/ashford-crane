import type { Currency } from "@/lib/money";

/** Provider adapter interfaces (spec Section 28). */

export class ProviderUnavailableError extends Error {
  constructor(provider: string) {
    super(`${provider} provider is currently unavailable`);
    this.name = "ProviderUnavailableError";
  }
}

export interface BankingProvider {
  /** Reported once the underlying payment has actually completed. */
  reportTransferStatus(transferId: string): Promise<"completed" | "failed" | "processing">;
  getBalance(accountId: string): Promise<number>;
}

export interface CardIssuer {
  setFrozen(cardToken: string, frozen: boolean): Promise<void>;
  setLimit(cardToken: string, limitMinor: number): Promise<void>;
}

export interface FxProvider {
  getRate(from: Currency, to: Currency): Promise<number>;
}

export interface KycProvider {
  submitApplication(applicationId: string): Promise<{ reference: string }>;
}

export interface ScreeningProvider {
  screen(name: string): Promise<{ hits: number }>;
}
