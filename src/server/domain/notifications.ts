import { nextId, type InMemoryStore } from "../store";
import type { Notification } from "../types";

/** Create an in-store notification for one user (spec Section 25). */
export function notify(
  store: InMemoryStore,
  input: { userId: string; kind: string; text: string },
): Notification {
  const n: Notification = {
    id: nextId(store, "ntf"),
    read: false,
    createdAt: Date.now(),
    ...input,
  };
  store.notifications.set(n.id, n);
  return n;
}

/** Notify every user belonging to a customer (multi-user corporate tiers). */
export function notifyCustomer(
  store: InMemoryStore,
  input: { customerId: string; kind: string; text: string },
): void {
  for (const u of store.users.values()) {
    if (u.customerId === input.customerId) {
      notify(store, { userId: u.id, kind: input.kind, text: input.text });
    }
  }
}
