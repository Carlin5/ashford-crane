import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { errorEnvelope, parseBody, requireSession } from "@/server/api";
import { getStore, nextId } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { audit } from "@/server/domain/audit";
import { isCurrency } from "@/lib/money";

const schema = z.object({
  name: z.string().min(1),
  accountIdentifier: z.string().min(3),
  currency: z.string(),
  bankName: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const beneficiaries = [...store.beneficiaries.values()].filter(
    (b) => b.customerId === session.customerId,
  );
  return NextResponse.json({ beneficiaries });
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  if (!isCurrency(body.currency)) {
    return errorEnvelope(400, "validation", "Unsupported currency.");
  }
  const store = getStore();
  ensureSeed(store);
  const b = {
    id: nextId(store, "ben"),
    customerId: session.customerId!,
    name: body.name,
    accountIdentifier: body.accountIdentifier,
    currency: body.currency,
    bankName: body.bankName,
  };
  store.beneficiaries.set(b.id, b);
  audit(store, {
    actorId: session.userId, actorRole: session.role,
    action: "beneficiary.create", target: b.id,
  });
  return NextResponse.json({ beneficiary: b }, { status: 201 });
}
