import "server-only";
import type { Role } from "./types";
import { can } from "./domain/rbac";
import { maskEmail, maskPhone, maskValue, maskKycData } from "./pii-masking";

export { maskEmail, maskPhone, maskValue, maskKycData };

/** Roles without view_customer_profiles see masked PII (spec Section 23). */
export function piiMasked(role: Role): boolean {
  return !can(role, "view_customer_profiles");
}
