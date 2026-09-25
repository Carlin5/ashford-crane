import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";

export async function GET(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const store = getStore();
  ensureSeed(store);
  const notifications = [...store.notifications.values()]
    .filter((n) => n.userId === session.userId)
    .sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ notifications });
}
