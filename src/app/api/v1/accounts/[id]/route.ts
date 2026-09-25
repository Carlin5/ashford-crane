import { NextResponse, type NextRequest } from "next/server";
import { errorEnvelope, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor, entriesForAccount } from "@/server/domain/ledger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  const account = store.accounts.get(id);
  if (!account || account.customerId !== session.customerId) {
    return errorEnvelope(404, "not_found", "Account not found.");
  }
  return NextResponse.json({
    account: { ...account, balanceMinor: balanceFor(store, id) },
    entries: entriesForAccount(store, id),
  });
}
