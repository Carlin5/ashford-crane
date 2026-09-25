/**
 * Money helpers. All amounts are integer minor units — never floats.
 */

export type Currency = "USD" | "EUR" | "GBP" | "UGX" | "KES" | "AED";

export const CURRENCY_PRECISION: Record<Currency, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  UGX: 0,
  KES: 2,
  AED: 2,
};

export function isCurrency(code: string): code is Currency {
  return code in CURRENCY_PRECISION;
}

/** Convert integer minor units to a decimal number (e.g. 12345 USD -> 123.45). */
export function toMajor(amountMinor: number, currency: Currency): number {
  return amountMinor / 10 ** CURRENCY_PRECISION[currency];
}

/** Convert a decimal amount to integer minor units, rounding half up. */
export function toMinor(amountMajor: number, currency: Currency): number {
  return Math.round(amountMajor * 10 ** CURRENCY_PRECISION[currency]);
}

/** Format integer minor units for display, e.g. "12,000.00 USD" style via Intl. */
export function formatMoney(
  amountMinor: number,
  currency: Currency,
  locale = "en-US",
): string {
  const p = CURRENCY_PRECISION[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: p,
    maximumFractionDigits: p,
  }).format(amountMinor / 10 ** p);
}

/**
 * Screen-reader label spelling the amount out, e.g. "twelve thousand US
 * dollars" — uses Intl currencyDisplay 'name' (spec Section 31).
 */
export function moneyAriaLabel(
  amountMinor: number,
  currency: Currency,
  locale = "en-US",
): string {
  const p = CURRENCY_PRECISION[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "name",
    minimumFractionDigits: p,
    maximumFractionDigits: p,
  }).format(amountMinor / 10 ** p);
}
