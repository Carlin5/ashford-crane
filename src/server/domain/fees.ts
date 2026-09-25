import type { Currency } from "@/lib/money";
import {
  FX_SPREAD_BPS,
  REFERENCE_RATE_SOURCE,
  TRANSFER_FEES,
} from "../../../config/fees";

export type FeeQuote = {
  feeMinor: number;
  fxRate: number;
  referenceRateSource: string;
  recipientAmountMinor: number;
};

/**
 * Quote a transfer fee + FX entirely from config — never hardcoded in UI.
 * `referenceRate` is the mid-market rate units of `to` per 1 `from`
 * (1 when same currency); the sandbox FxProvider supplies it.
 */
export function quoteTransfer(input: {
  amountMinor: number;
  from: Currency;
  to: Currency;
  corridor?: string;
  referenceRate?: number;
}): FeeQuote {
  const rule = TRANSFER_FEES[input.corridor ?? "default"] ?? TRANSFER_FEES.default;
  const feeMinor =
    rule.flatMinor + Math.round((input.amountMinor * rule.percentBps) / 10_000);
  const mid = input.referenceRate ?? 1;
  const fxRate = mid * (1 - FX_SPREAD_BPS / 10_000);
  const recipientAmountMinor = Math.round(
    (input.amountMinor - feeMinor) * fxRate,
  );
  return { feeMinor, fxRate, referenceRateSource: REFERENCE_RATE_SOURCE, recipientAmountMinor };
}
