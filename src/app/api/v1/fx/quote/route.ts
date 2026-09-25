import { NextResponse, type NextRequest } from "next/server";
import { errorEnvelope, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { makeProviders } from "@/server/domain/providers/sandbox";
import { quoteTransfer } from "@/server/domain/fees";
import { ProviderUnavailableError } from "@/server/domain/providers/interfaces";
import { isCurrency } from "@/lib/money";

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const q = req.nextUrl.searchParams;
  const from = q.get("from") ?? "";
  const to = q.get("to") ?? "";
  const amountMinor = Number(q.get("amountMinor") ?? "0");
  if (!isCurrency(from) || !isCurrency(to) || !Number.isInteger(amountMinor) || amountMinor <= 0) {
    return errorEnvelope(400, "validation", "from, to, and a positive integer amountMinor are required.");
  }
  const store = getStore();
  ensureSeed(store);
  try {
    const mid = await makeProviders(store).fx.getRate(from, to);
    const quote = quoteTransfer({ amountMinor, from, to, referenceRate: mid });
    return NextResponse.json({ quote });
  } catch (e) {
    if (e instanceof ProviderUnavailableError) {
      return errorEnvelope(503, "provider_unavailable", "We couldn't refresh rates just now — try again shortly.");
    }
    throw e;
  }
}
