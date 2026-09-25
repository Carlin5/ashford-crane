import { formatMoney, moneyAriaLabel, type Currency } from "@/lib/money";

/**
 * Displays an integer minor-units amount. The aria-label spells the amount
 * out ("twelve thousand US dollars") rather than reading characters.
 */
export function Money({
  amountMinor,
  currency,
  locale = "en-US",
  className = "",
}: {
  amountMinor: number;
  currency: Currency;
  locale?: string;
  className?: string;
}) {
  return (
    <span
      className={`tnum ${className}`}
      aria-label={moneyAriaLabel(amountMinor, currency, locale)}
    >
      {formatMoney(amountMinor, currency, locale)}
    </span>
  );
}
