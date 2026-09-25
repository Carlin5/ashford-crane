/**
 * Fee schedule (spec Section 15). All fee logic lives here — never hardcoded
 * in UI. Amounts are integer minor units. Values are configurable; review
 * with legal/compliance before publication in each jurisdiction.
 */
export type FeeRule = {
  category: string;
  model: string;
  note?: string;
};

export const FEE_SCHEDULE: FeeRule[] = [
  {
    category: "Account maintenance",
    model: "Flat monthly or annual fee, tier-dependent",
    note: "May be zero at base tier",
  },
  {
    category: "International transfer fee",
    model: "Flat fee plus percentage, configured per corridor",
    note: "Disclosed before confirmation",
  },
  {
    category: "FX spread",
    model: "Basis-point markup over a disclosed reference rate",
    note: "Reference-rate source is named on every quote",
  },
  {
    category: "Card issuance / replacement",
    model: "Flat fee per card",
    note: "First card optionally waived",
  },
  {
    category: "ATM withdrawal",
    model: "Flat fee plus possible operator surcharge passthrough",
    note: "Local ATM operator surcharges may apply",
  },
  {
    category: "Corporate account",
    model: "Tiered by employee and card count",
  },
  {
    category: "Premium relationship management",
    model: "Included at Private Plus and above, or subscription add-on",
  },
  {
    category: "Institutional / enterprise services",
    model: "Custom quoted",
  },
];

export type TransferFee = {
  flatMinor: number;
  percentBps: number;
};

/** Illustrative corridor fee configuration (sandbox defaults). */
export const TRANSFER_FEES: Record<string, TransferFee> = {
  default: { flatMinor: 1500, percentBps: 50 },
};

/** FX spread in basis points over the reference rate. */
export const FX_SPREAD_BPS = 80;

export const REFERENCE_RATE_SOURCE = "[Reference-rate source — pending]";
