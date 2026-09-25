import type { Currency } from "@/lib/money";

export type Role =
  | "client"
  | "super_admin"
  | "compliance_officer"
  | "operations_officer"
  | "customer_support"
  | "relationship_manager"
  | "finance_officer"
  | "risk_officer";

export const STAFF_ROLES: Role[] = [
  "super_admin",
  "compliance_officer",
  "operations_officer",
  "customer_support",
  "relationship_manager",
  "finance_officer",
  "risk_officer",
];

export type Tier = "private" | "private_plus" | "corporate" | "institutional";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string; // sandbox: sha256 hex of password
  customerId?: string;
  assignedCustomerIds?: string[]; // RM portal
};

export type Customer = {
  id: string;
  kind: "individual" | "business";
  name: string;
  tier: Tier;
  riskRating?: "low" | "medium" | "high";
};

export type Account = {
  id: string;
  customerId: string;
  name: string;
  currency: Currency;
  identifier: string;
  status: "active" | "restricted" | "closed";
};

export type Direction = "debit" | "credit";

export type TransactionEntry = {
  id: string;
  transactionId: string;
  accountId: string;
  direction: Direction;
  amountMinor: number;
  currency: Currency;
};

export type Transaction = {
  id: string;
  description: string;
  reference: string;
  status: "posted" | "reversed";
  source: "transfer" | "card" | "fee" | "adjustment" | "seed";
  createdAt: number;
  authorization?: { approvedBy: string[] };
};

export type Beneficiary = {
  id: string;
  customerId: string;
  name: string;
  accountIdentifier: string;
  currency: Currency;
  bankName: string;
};

export const TRANSFER_STATUSES = [
  "Draft",
  "PendingVerification",
  "Processing",
  "Completed",
  "Failed",
  "Rejected",
  "Cancelled",
] as const;
export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export type Transfer = {
  id: string;
  customerId: string;
  createdBy: string;
  sourceAccountId: string;
  beneficiaryId: string;
  currency: Currency;
  amountMinor: number;
  feeMinor: number;
  fxRate?: number;
  recipientAmountMinor?: number;
  recipientCurrency?: Currency;
  status: TransferStatus;
  reference: string;
  requiresApproval: boolean;
  approvals: string[];
  scheduledFor?: number;
  createdAt: number;
  submittedAt?: number;
  transactionId?: string;
};

export type Card = {
  id: string;
  customerId: string;
  accountId: string;
  label: string;
  last4: string;
  token: string;
  expiry: string;
  status: "active" | "frozen";
  limitMinor: number;
  controls: {
    atm: boolean;
    online: boolean;
    contactless: boolean;
    allowedRegions: string[];
  };
};

export const KYC_STATUSES = [
  "ApplicationStarted",
  "DocumentsRequired",
  "UnderReview",
  "AdditionalInfoRequired",
  "Approved",
  "Declined",
  "Restricted",
] as const;
export type KycStatus = (typeof KYC_STATUSES)[number];

export type KycApplication = {
  id: string;
  kind: "individual" | "business";
  applicantEmail: string;
  status: KycStatus;
  data: Record<string, unknown>;
  documents: { name: string; type: string; uploadedAt: number }[];
  history: { status: KycStatus; at: number; by?: string }[];
  createdAt: number;
};

export type ComplianceAlert = {
  id: string;
  customerId: string;
  kind: "velocity" | "geographic" | "unusual_amount";
  detail: string;
  status: "open" | "reviewing" | "dismissed";
  createdAt: number;
};

export type ComplianceCase = {
  id: string;
  customerId: string;
  status: "open" | "assigned" | "info_requested" | "escalated" | "closed";
  assigneeId?: string;
  notes: { by: string; text: string; at: number }[];
  createdAt: number;
};

export type SupportTicket = {
  id: string;
  customerId: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: number;
};

export type MessageThread = {
  id: string;
  customerId: string;
  subject: string;
  messages: { from: "client" | "staff"; text: string; at: number }[];
};

export type Notification = {
  id: string;
  userId: string;
  kind: string;
  text: string;
  read: boolean;
  createdAt: number;
};

export type SessionRecord = {
  id: string;
  userId: string;
  deviceLabel: string;
  ip: string;
  createdAt: number;
  current?: boolean;
};

export type Device = {
  id: string;
  userId: string;
  label: string;
  lastSeenAt: number;
};

export type AuditEntry = {
  id: string;
  actorId: string;
  actorRole: Role;
  action: string;
  target: string;
  detail?: string;
  at: number;
};

export type IdempotencyRecord = {
  key: string;
  userId: string;
  status: number;
  body: unknown;
};

export type ProviderHealthMap = Record<string, "up" | "down">;

export type JurisdictionRow = {
  country: string;
  servicesAvailable: string;
  onboardingStatus: string;
  regulatoryNotes: string;
};
