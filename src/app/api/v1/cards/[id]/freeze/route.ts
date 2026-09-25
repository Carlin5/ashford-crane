import { NextResponse, type NextRequest } from "next/server";
import { errorEnvelope, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { freezeCard } from "@/server/domain/cards";
import { makeProviders } from "@/server/domain/providers/sandbox";
import { audit } from "@/server/domain/audit";
import { notifyCustomer } from "@/server/domain/notifications";

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
  await makeProviders(store).cardIssuer.setFrozen(card.token, true);
  freezeCard(store, id);
  audit(store, {
    actorId: session.userId, actorRole: session.role,
    action: "card.freeze", target: id,
  });
  notifyCustomer(store, {
    customerId: card.customerId,
    kind: "card",
    text: `Card ending ${card.last4} was frozen.`,
  });
  return NextResponse.json({ card: store.cards.get(id) });
}
