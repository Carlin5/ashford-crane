import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  errorEnvelope,
  parseBody,
  requireSession,
  withIdempotency,
} from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { createTransfer, submitTransfer, authorizeTransfer } from "@/server/domain/transfers";
import { audit } from "@/server/domain/audit";
import { notifyCustomer } from "@/server/domain/notifications";
import { CURRENCY_PRECISION, isCurrency } from "@/lib/money";

const schema = z.object({
  sourceAccountId: z.string(),
  beneficiaryId: z.string(),
  currency: z.string(),
  amountMinor: z.number().int().positive(),
  feeMinor: z.number().int().nonnegative(),
  recipientAmountMinor: z.number().int().nonnegative().optional(),
  recipientCurrency: z.string().optional(),
  fxRate: z.number().positive().optional(),
  scheduledFor: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const limited = session.role === "client" ? null : null;
  void limited;
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  const store = getStore();
  ensureSeed(store);

  const account = store.accounts.get(body.sourceAccountId);
  const beneficiary = store.beneficiaries.get(body.beneficiaryId);
  if (!account || account.customerId !== session.customerId) {
    return errorEnvelope(404, "not_found", "Source account not found.");
  }
  if (!beneficiary || beneficiary.customerId !== session.customerId) {
    return errorEnvelope(404, "not_found", "Beneficiary not found.");
  }
  if (!isCurrency(body.currency) || !(body.currency in CURRENCY_PRECISION)) {
    return errorEnvelope(400, "validation", "Unsupported currency.");
  }

  return withIdempotency(req, session.userId, async () => {
    const customer = store.customers.get(session.customerId!);
    const requiresApproval = customer?.tier === "corporate" || customer?.tier === "institutional";
    const t = createTransfer(store, {
      customerId: session.customerId!,
      createdBy: session.userId,
      sourceAccountId: body.sourceAccountId,
      beneficiaryId: body.beneficiaryId,
      currency: body.currency as never,
      amountMinor: body.amountMinor,
      feeMinor: body.feeMinor,
      recipientAmountMinor: body.recipientAmountMinor,
      recipientCurrency: body.recipientCurrency as never,
      fxRate: body.fxRate,
      requiresApproval,
      scheduledFor: body.scheduledFor,
    });
    submitTransfer(store, t.id);
    // Non-corporate transfers can be authorized straight into Processing.
    if (!requiresApproval) authorizeTransfer(store, t.id);
    audit(store, {
      actorId: session.userId, actorRole: session.role,
      action: "transfer.create", target: t.id,
      detail: `${body.amountMinor} ${body.currency}`,
    });
    notifyCustomer(store, {
      customerId: session.customerId!,
      kind: "transfer",
      text: requiresApproval
        ? `Transfer ${t.reference} is awaiting authorization.`
        : `Transfer ${t.reference} was created and is processing.`,
    });
    return { status: 201, body: { transfer: t } };
  });
}

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const transfers = [...store.transfers.values()]
    .filter((t) => t.customerId === session.customerId)
    .sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ transfers });
}
