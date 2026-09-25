/**
 * Client tiers (spec Section 14). Numeric eligibility thresholds stay in
 * configuration and are defined with legal/compliance per jurisdiction —
 * until finalized, copy reads "Eligibility assessed individually".
 */
export type Tier = {
  id: string;
  name: string;
  designedFor: string;
  features: string[];
};

export const TIERS: Tier[] = [
  {
    id: "private",
    name: "Private",
    designedFor: "Individual clients",
    features: [
      "Multi-currency accounts",
      "Ashford Private Card",
      "Digital relationship-manager access",
    ],
  },
  {
    id: "private-plus",
    name: "Private Plus",
    designedFor: "Clients with more complex international needs",
    features: [
      "Priority relationship manager",
      "Expanded FX limits",
      "Wealth-reporting dashboard",
    ],
  },
  {
    id: "corporate",
    name: "Corporate",
    designedFor: "Companies and organizations",
    features: [
      "Multi-user access",
      "Approvals workflow",
      "Expense management",
      "Accounting exports",
    ],
  },
  {
    id: "institutional",
    name: "Institutional",
    designedFor: "Eligible institutional clients",
    features: [
      "Dedicated onboarding",
      "Bespoke reporting",
      "API access",
    ],
  },
];

export const ELIGIBILITY_COPY = "Eligibility assessed individually";
