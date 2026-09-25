import type {
  Account,
  Card,
  ComplianceAlert,
  ComplianceCase,
  KycStatus,
  SupportTicket,
  TransferStatus,
} from "@/server/types";

/**
 * Human-readable labels for every status enum (spec voice: sentence case,
 * no raw enum names in the UI).
 */
const LABELS: Record<string, string> = {
  // Transfers
  Draft: "Draft",
  PendingVerification: "Pending verification",
  Processing: "Processing",
  Completed: "Completed",
  Failed: "Failed",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
  // KYC
  ApplicationStarted: "Application started",
  DocumentsRequired: "Documents required",
  UnderReview: "Under review",
  AdditionalInfoRequired: "Additional information required",
  Approved: "Approved",
  Declined: "Declined",
  Restricted: "Restricted",
  // Compliance alerts
  open: "Open",
  reviewing: "Under review",
  dismissed: "Dismissed",
  // Compliance cases
  assigned: "Assigned",
  info_requested: "Information requested",
  escalated: "Escalated",
  closed: "Closed",
  // Support tickets
  in_progress: "In progress",
  resolved: "Resolved",
  // Cards + accounts
  active: "Active",
  frozen: "Frozen",
  restricted: "Restricted",
  // Ledger transactions
  posted: "Posted",
  reversed: "Reversed",
};

const TIER_LABELS: Record<string, string> = {
  private: "Private",
  private_plus: "Private Plus",
  corporate: "Corporate",
  institutional: "Institutional",
};

export function tierLabel(tier: string): string {
  return TIER_LABELS[tier] ?? tier.replaceAll("_", " ");
}

export function statusLabel(
  status:
    | TransferStatus
    | KycStatus
    | ComplianceAlert["status"]
    | ComplianceCase["status"]
    | SupportTicket["status"]
    | Card["status"]
    | Account["status"]
    | "posted"
    | "reversed"
    | string,
): string {
  return LABELS[status] ?? status;
}
