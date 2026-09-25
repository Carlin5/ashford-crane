import { PENDING } from "@/lib/compliance";

/**
 * Jurisdiction availability (spec Section 20.6): configurable table populated
 * only as real availability is confirmed — never a hardcoded country list
 * implying licensing that doesn't exist.
 */
export type JurisdictionRow = {
  country: string;
  servicesAvailable: string;
  onboardingStatus: string;
  regulatoryNotes: string;
};

export const JURISDICTIONS: JurisdictionRow[] = [
  {
    country: "United Kingdom",
    servicesAvailable: PENDING,
    onboardingStatus: PENDING,
    regulatoryNotes: PENDING,
  },
  {
    country: "United Arab Emirates",
    servicesAvailable: PENDING,
    onboardingStatus: PENDING,
    regulatoryNotes: PENDING,
  },
  {
    country: "Uganda",
    servicesAvailable: PENDING,
    onboardingStatus: PENDING,
    regulatoryNotes: PENDING,
  },
  {
    country: "Kenya",
    servicesAvailable: PENDING,
    onboardingStatus: PENDING,
    regulatoryNotes: PENDING,
  },
  {
    country: "European Economic Area",
    servicesAvailable: PENDING,
    onboardingStatus: PENDING,
    regulatoryNotes: PENDING,
  },
];
