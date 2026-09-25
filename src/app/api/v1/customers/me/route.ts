import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const customer = store.customers.get(session.customerId ?? "");
  return NextResponse.json({
    user: { id: session.userId, email: session.email, name: session.name, role: session.role },
    customer: customer ?? null,
  });
}
