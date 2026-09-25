import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { balanceFor } from "@/server/domain/ledger";

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const accounts = [...store.accounts.values()]
    .filter((a) => a.customerId === session.customerId)
    .map((a) => ({ ...a, balanceMinor: balanceFor(store, a.id) }));
  return NextResponse.json({ accounts });
}
