"use client";

import { CountUp } from "@/components/motion/CountUp";
import { formatMoney, moneyAriaLabel, type Currency } from "@/lib/money";

/** Total balance figure that tweens on update ("4D" live numeric). */
export function TotalBalance({
  amountMinor,
  currency,
}: {
  amountMinor: number;
  currency: Currency;
}) {
  return (
    <span aria-label={moneyAriaLabel(amountMinor, currency)}>
      <CountUp
        value={amountMinor}
        format={(v) =>
          formatMoney(Math.round(v), currency)
        }
      />
    </span>
  );
}
