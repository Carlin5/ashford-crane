"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { transition } from "@/server/domain/kyc";
import {
  approveTransfer,
  authorizeTransfer,
  rejectTransfer,
} from "@/server/domain/transfers";
import { freezeCard, unfreezeCard } from "@/server/domain/cards";
import { actOnCase, openCase } from "@/server/domain/compliance";
import { makeProviders } from "@/server/domain/providers/sandbox";
import { audit } from "@/server/domain/audit";
import { notify, notifyCustomer } from "@/server/domain/notifications";
import type { KycStatus, Role } from "@/server/types";

type Result = { error?: string };

async function actor(): Promise<{ userId: string; role: Role } | { error: string }> {
  const s = await getSession();
  if (!s.userId || s.mfa !== "complete" || !s.role || s.role === "client") {
    return { error: "Sign in as staff required." };
  }
  return { userId: s.userId, role: s.role };
}

export async function kycAction(
  applicationId: string,
  to: KycStatus,
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "review_kyc")) {
    return { error: "Your role cannot review applications." };
  }
  const store = getStore();
  ensureSeed(store);
  try {
    transition(store, applicationId, to, a.userId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Transition failed." };
  }
  const app = store.kycApplications.get(applicationId)!;
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: `kyc.${to}`,
    target: applicationId,
  });
  const user = store.users.get(app.applicantEmail);
  if (user) {
    notify(store, {
      userId: user.id,
      kind: "kyc",
      text: `Your application status is now ${to}.`,
    });
  }
  revalidatePath("/admin/applications");
  revalidatePath("/admin/kyc");
  revalidatePath("/admin/kyb");
  return {};
}

export async function approveTransferAction(
  transferId: string,
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "approve_transfers")) {
    return { error: "Your role cannot authorize fund movements." };
  }
  const store = getStore();
  ensureSeed(store);
  const t = store.transfers.get(transferId);
  if (!t) return { error: "Transfer not found." };
  try {
    approveTransfer(store, transferId, { userId: a.userId, role: a.role });
    if (!t.requiresApproval && t.status === "PendingVerification") {
      authorizeTransfer(store, transferId);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Approval failed." };
  }
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: "transfer.approve",
    target: transferId,
    detail: `${t.approvals.length} of 2 authorizations`,
  });
  revalidatePath("/admin/transfers");
  return {};
}

export async function rejectTransferAction(
  transferId: string,
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "approve_transfers")) {
    return { error: "Your role cannot authorize fund movements." };
  }
  const store = getStore();
  ensureSeed(store);
  try {
    rejectTransfer(store, transferId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Rejection failed." };
  }
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: "transfer.reject",
    target: transferId,
  });
  revalidatePath("/admin/transfers");
  return {};
}

export async function cardAction(
  cardId: string,
  op: "freeze" | "unfreeze",
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "freeze_cards")) {
    return { error: "Your role cannot manage cards." };
  }
  // Customer Support may freeze a card but never unfreeze one.
  if (op === "unfreeze" && a.role === "customer_support") {
    return { error: "Support agents can freeze cards only." };
  }
  const store = getStore();
  ensureSeed(store);
  const card = store.cards.get(cardId);
  if (!card) return { error: "Card not found." };
  try {
    await makeProviders(store).cardIssuer.setFrozen(card.token, op === "freeze");
    if (op === "freeze") freezeCard(store, cardId);
    else unfreezeCard(store, cardId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Card action failed." };
  }
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: `card.${op}`,
    target: cardId,
  });
  notifyCustomer(store, {
    customerId: card.customerId,
    kind: "card",
    text:
      op === "freeze"
        ? `Card ending ${card.last4} was frozen.`
        : `Card ending ${card.last4} was reactivated.`,
  });
  revalidatePath("/admin/cards");
  return {};
}

export async function openCaseFromAlert(alertId: string): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "manage_cases")) {
    return { error: "Your role cannot open cases." };
  }
  const store = getStore();
  ensureSeed(store);
  const alert = store.alerts.get(alertId);
  if (!alert) return { error: "Alert not found." };
  openCase(store, { customerId: alert.customerId, openedBy: a });
  alert.status = "reviewing";
  revalidatePath("/admin/compliance/alerts");
  revalidatePath("/admin/compliance/cases");
  return {};
}

export async function caseAction(
  caseId: string,
  action: "assign" | "note" | "requestInfo" | "restrict" | "escalate" | "close",
  note?: string,
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  const perm = action === "escalate" ? "escalate_cases" : "manage_cases";
  if (!can(a.role, perm)) {
    return { error: "Your role cannot perform this case action." };
  }
  const store = getStore();
  ensureSeed(store);
  try {
    actOnCase(store, caseId, action, a, { note });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Case action failed." };
  }
  revalidatePath("/admin/compliance/cases");
  return {};
}

export async function setProviderHealth(
  provider: string,
  status: "up" | "down",
): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "configure_system")) {
    return { error: "Your role cannot change system settings." };
  }
  const store = getStore();
  ensureSeed(store);
  store.providerHealth[provider] = status;
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: "provider.health",
    target: provider,
    detail: status,
  });
  revalidatePath("/admin/settings");
  return {};
}

export async function addJurisdiction(formData: FormData): Promise<Result> {
  const a = await actor();
  if ("error" in a) return { error: a.error };
  if (!can(a.role, "configure_system")) {
    return { error: "Your role cannot change jurisdiction availability." };
  }
  const country = String(formData.get("country") ?? "").trim();
  if (!country) return { error: "Country is required." };
  const store = getStore();
  ensureSeed(store);
  store.jurisdictions.push({
    country,
    servicesAvailable: String(formData.get("servicesAvailable") ?? ""),
    onboardingStatus: String(formData.get("onboardingStatus") ?? ""),
    regulatoryNotes: String(formData.get("regulatoryNotes") ?? ""),
  });
  audit(store, {
    actorId: a.userId,
    actorRole: a.role,
    action: "jurisdiction.add",
    target: country,
  });
  revalidatePath("/admin/settings");
  return {};
}
