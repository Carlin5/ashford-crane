import { NextResponse, type NextRequest } from "next/server";
import { errorEnvelope, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { advanceTransfer } from "@/server/domain/transfer-lifecycle";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  const t = await advanceTransfer(id);
  if (!t || t.customerId !== session.customerId) {
    return errorEnvelope(404, "not_found", "Transfer not found.");
  }
  return NextResponse.json({ transfer: t });
}
