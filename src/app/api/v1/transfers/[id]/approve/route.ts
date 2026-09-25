import { NextResponse, type NextRequest } from "next/server";
import {
  errorEnvelope,
  requireRole,
  requireSession,
} from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { approveTransfer, authorizeTransfer } from "@/server/domain/transfers";
import { audit } from "@/server/domain/audit";
import { DualControlError } from "@/server/domain/rbac";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const denied = requireRole(session, ["operations_officer", "finance_officer"]);
  if (denied) return denied;
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  const t = store.transfers.get(id);
  if (!t) return errorEnvelope(404, "not_found", "Transfer not found.");
  if (t.approvals.includes(session.userId)) {
    return errorEnvelope(409, "already_approved", "You have already authorized this transfer; a second distinct authorizer is required.");
  }
  try {
    approveTransfer(store, id, { userId: session.userId, role: session.role });
    if (!t.requiresApproval && t.status === "PendingVerification") {
      authorizeTransfer(store, id);
    }
  } catch (e) {
    if (e instanceof DualControlError) {
      return errorEnvelope(403, "dual_control", e.message);
    }
    throw e;
  }
  audit(store, {
    actorId: session.userId, actorRole: session.role,
    action: "transfer.approve", target: id,
    detail: `${t.approvals.length} of 2 authorizations`,
  });
  return NextResponse.json({ transfer: t });
}
