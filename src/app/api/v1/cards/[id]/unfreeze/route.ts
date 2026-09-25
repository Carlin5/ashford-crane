import { NextResponse, type NextRequest } from "next/server";
import { errorEnvelope, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { unfreezeCard } from "@/server/domain/cards";
import { makeProviders } from "@/server/domain/providers/sandbox";
import { audit } from "@/server/domain/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  const store = getStore();
  ensureSeed(store);
  const card = store.cards.get(id);
  if (!card || card.customerId !== session.customerId) {
    return errorEnvelope(404, "not_found", "Card not found.");
  }
  await makeProviders(store).cardIssuer.setFrozen(card.token, false);
  unfreezeCard(store, id);
  audit(store, {
    actorId: session.userId, actorRole: session.role,
    action: "card.unfreeze", target: id,
  });
  return NextResponse.json({ card: store.cards.get(id) });
}
