import type { Role } from "../types";

/** Permission matrix (spec Section 23). */
export type Permission =
  | "view_customer_profiles"
  | "view_customer_profiles_masked"
  | "view_assigned_customers"
  | "edit_customer_data"
  | "request_customer_edits"
  | "review_kyc"
  | "approve_transfers"
  | "freeze_cards"
  | "view_compliance"
  | "manage_cases"
  | "escalate_cases"
  | "manage_users"
  | "view_audit"
  | "configure_system"
  | "configure_fees";

const MATRIX: Record<Role, Permission[]> = {
  client: [],
  super_admin: [
    "view_customer_profiles",
    "edit_customer_data",
    "freeze_cards",
    "view_compliance",
    "manage_users",
    "view_audit",
    "configure_system",
  ],
  compliance_officer: [
    "view_customer_profiles",
    "edit_customer_data",
    "review_kyc",
    "freeze_cards",
    "view_compliance",
    "manage_cases",
    "view_audit",
  ],
  operations_officer: [
    "view_customer_profiles",
    "freeze_cards",
    "view_compliance",
    "view_audit",
    "configure_system",
    "approve_transfers",
  ],
  customer_support: ["view_customer_profiles_masked", "freeze_cards"],
  relationship_manager: ["view_assigned_customers", "request_customer_edits"],
  finance_officer: [
    "view_customer_profiles_masked",
    "approve_transfers",
    "view_audit",
    "configure_fees",
  ],
  risk_officer: [
    "view_customer_profiles",
    "freeze_cards",
    "view_compliance",
    "escalate_cases",
    "view_audit",
  ],
};

export function can(role: Role, permission: Permission): boolean {
  return MATRIX[role].includes(permission);
}

export class DualControlError extends Error {
  constructor(msg = "Dual control requires two distinct authorized staff") {
    super(msg);
    this.name = "DualControlError";
  }
}

/**
 * Any action that moves client funds needs two distinct staff users, each
 * holding approve_transfers — a single authorizer is never sufficient.
 */
export function assertDualControl(
  first: { userId: string; role: Role },
  second: { userId: string; role: Role },
): void {
  if (first.userId === second.userId) {
    throw new DualControlError("Authorizers must be two distinct users");
  }
  for (const u of [first, second]) {
    if (!can(u.role, "approve_transfers")) {
      throw new DualControlError(
        `Role ${u.role} cannot authorize fund movements`,
      );
    }
  }
}
