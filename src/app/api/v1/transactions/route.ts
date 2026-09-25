import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";

function toCsv(rows: string[][]): string {
  return rows
    .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const url = req.nextUrl.searchParams;
  const accountId = url.get("accountId");
  const currency = url.get("currency");
  const q = url.get("q")?.toLowerCase();
  const from = url.get("from") ? Date.parse(url.get("from")!) : null;
  const to = url.get("to") ? Date.parse(url.get("to")!) : null;

  const myAccountIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === session.customerId)
      .map((a) => a.id),
  );
  if (accountId && !myAccountIds.has(accountId)) {
    return NextResponse.json({ transactions: [] });
  }

  const seen = new Set<string>();
  const out: {
    id: string; accountId: string; direction: string; amountMinor: number;
    currency: string; description: string; reference: string; status: string;
    source: string; createdAt: number;
  }[] = [];
  for (const e of store.entries.values()) {
    if (!myAccountIds.has(e.accountId)) continue;
    if (accountId && e.accountId !== accountId) continue;
    const tx = store.transactions.get(e.transactionId);
    if (!tx) continue;
    if (currency && e.currency !== currency) continue;
    if (from && tx.createdAt < from) continue;
    if (to && tx.createdAt > to) continue;
    if (q && !tx.description.toLowerCase().includes(q) && !tx.reference.toLowerCase().includes(q)) continue;
    const key = `${e.transactionId}:${e.accountId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id: e.transactionId, accountId: e.accountId, direction: e.direction,
      amountMinor: e.amountMinor, currency: e.currency,
      description: tx.description, reference: tx.reference,
      status: tx.status, source: tx.source, createdAt: tx.createdAt,
    });
  }
  out.sort((a, b) => b.createdAt - a.createdAt);

  if (url.get("format") === "csv") {
    const csv = toCsv([
      ["date", "account", "description", "reference", "direction", "amount_minor", "currency", "status"],
      ...out.map((t) => [
        new Date(t.createdAt).toISOString(), t.accountId, t.description,
        t.reference, t.direction, String(t.amountMinor), t.currency, t.status,
      ]),
    ]);
    return new NextResponse(csv, {
      headers: {
        "content-type": "text/csv",
        "content-disposition": 'attachment; filename="transactions.csv"',
      },
    });
  }
  return NextResponse.json({ transactions: out });
}
