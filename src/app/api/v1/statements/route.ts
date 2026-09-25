import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";

/** Monthly statements list derived from posted transactions. */
export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const months = new Map<string, number>();
  const myAccountIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === session.customerId)
      .map((a) => a.id),
  );
  for (const e of store.entries.values()) {
    if (!myAccountIds.has(e.accountId)) continue;
    const tx = store.transactions.get(e.transactionId);
    if (!tx) continue;
    const key = new Date(tx.createdAt).toISOString().slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + 1);
  }
  const statements = [...months.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, count]) => ({
      month,
      transactionCount: count,
      csvUrl: `/api/v1/transactions?format=csv&from=${month}-01`,
    }));
  return NextResponse.json({ statements });
}
