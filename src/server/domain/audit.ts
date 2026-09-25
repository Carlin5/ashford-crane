import { nextId, type InMemoryStore } from "../store";
import type { AuditEntry, Role } from "../types";

/**
 * Append-only audit log. There is deliberately no update or delete function —
 * every sensitive action is recorded once and never edited.
 */
export function audit(
  store: InMemoryStore,
  entry: {
    actorId: string;
    actorRole: Role;
    action: string;
    target: string;
    detail?: string;
  },
): AuditEntry {
  const record: AuditEntry = {
    id: nextId(store, "audit"),
    at: Date.now(),
    ...entry,
  };
  store.auditLog.set(record.id, record);
  return record;
}

export function auditTrail(store: InMemoryStore): AuditEntry[] {
  return [...store.auditLog.values()].sort((a, b) => b.at - a.at);
}
