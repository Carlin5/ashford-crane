/**
 * Compliance guardrails (spec Sections 20 and 22).
 * Anywhere a real legal/regulatory fact does not yet exist, the interface
 * must display PENDING rather than a plausible-sounding placeholder.
 */
export const PENDING = "Information pending regulatory confirmation";

export const PLACEHOLDER = "[Pending — insert once confirmed]";

/**
 * Section 20.1 positioning statement template.
 * Fill bracketed fields only with verified real details.
 */
export function positioningStatement(fields?: {
  legalEntityName?: string;
  regulatedActivity?: string;
  partnerName?: string;
  regulator?: string;
  licenseNumber?: string;
}): string {
  const entity = fields?.legalEntityName ?? "[legal entity name — pending]";
  const activity =
    fields?.regulatedActivity ??
    "[regulated activity — e.g., payment services / e-money issuance]";
  const partner = fields?.partnerName ?? "[Partner name — pending]";
  const regulator = fields?.regulator ?? "[Regulator — pending]";
  const license = fields?.licenseNumber ?? "[pending]";
  return (
    `Ashford & Crane ${entity} is a financial technology company. ` +
    `${activity} is provided in partnership with ${partner}, authorized and ` +
    `regulated by ${regulator}, registration/license number ${license}. ` +
    `Ashford & Crane does not hold client funds directly unless and until ` +
    `it obtains the applicable license(s).`
  );
}

/**
 * Section 28 partner disclosure template.
 */
export function partnerDisclosure(fields?: {
  service?: string;
  partnerName?: string;
  regulator?: string;
  licenseNumber?: string;
}): string {
  const service = fields?.service ?? "[Service]";
  const partner = fields?.partnerName ?? "[Partner legal name — pending]";
  const regulator = fields?.regulator ?? "[Regulator — pending]";
  const license = fields?.licenseNumber ?? "[pending]";
  return `${service} is provided by ${partner}, regulated by ${regulator} under ${license}.`;
}

export const DEMO_BANNER_TEXT = "DEMO ENVIRONMENT — NO REAL FUNDS.";

export function isDemoEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_ENV !== "production";
}
