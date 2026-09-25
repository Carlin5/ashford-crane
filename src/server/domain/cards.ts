import { nextId, type InMemoryStore } from "../store";
import type { Card } from "../types";

/**
 * Card domain. Only last4 + a token are ever stored — raw card numbers and
 * CVV never touch this layer (spec Section 19).
 */
export function issueCard(
  store: InMemoryStore,
  input: {
    customerId: string;
    accountId: string;
    label: string;
    last4: string;
    token: string;
    expiry: string;
    limitMinor: number;
  },
): Card {
  if (!/^\d{4}$/.test(input.last4)) {
    throw new Error("last4 must be exactly four digits");
  }
  const card: Card = {
    id: nextId(store, "card"),
    status: "active",
    controls: { atm: true, online: true, contactless: true, allowedRegions: [] },
    ...input,
  };
  store.cards.set(card.id, card);
  return card;
}

export function freezeCard(store: InMemoryStore, cardId: string): Card {
  const card = mustGet(store, cardId);
  card.status = "frozen";
  return card;
}

export function unfreezeCard(store: InMemoryStore, cardId: string): Card {
  const card = mustGet(store, cardId);
  card.status = "active";
  return card;
}

export function setLimit(
  store: InMemoryStore,
  cardId: string,
  limitMinor: number,
): Card {
  if (!Number.isInteger(limitMinor) || limitMinor <= 0) {
    throw new Error("limit must be a positive integer in minor units");
  }
  const card = mustGet(store, cardId);
  card.limitMinor = limitMinor;
  return card;
}

export function setControl(
  store: InMemoryStore,
  cardId: string,
  key: "atm" | "online" | "contactless",
  enabled: boolean,
): Card {
  const card = mustGet(store, cardId);
  card.controls[key] = enabled;
  return card;
}

export function setRegions(
  store: InMemoryStore,
  cardId: string,
  regions: string[],
): Card {
  const card = mustGet(store, cardId);
  card.controls.allowedRegions = regions;
  return card;
}

function mustGet(store: InMemoryStore, cardId: string): Card {
  const card = store.cards.get(cardId);
  if (!card) throw new Error(`Unknown card ${cardId}`);
  return card;
}
