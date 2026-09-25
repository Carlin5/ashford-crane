import { nextId, type InMemoryStore } from "../store";
import { audit } from "./audit";
import type {
  ComplianceAlert,
  ComplianceCase,
  Role,
} from "../types";

/** Create a monitoring alert (velocity, geographic, unusual amount). */
export function raiseAlert(
  store: InMemoryStore,
  input: {
    customerId: string;
    kind: ComplianceAlert["kind"];
    detail: string;
  },
): ComplianceAlert {
  const alert: ComplianceAlert = {
    id: nextId(store, "alert"),
    status: "open",
    createdAt: Date.now(),
    ...input,
  };
  store.alerts.set(alert.id, alert);
  return alert;
}

/** Velocity check: flag >maxCount outgoing debits within windowMs. */
export function checkVelocity(
  store: InMemoryStore,
  customerId: string,
  windowMs = 60 * 60 * 1000,
  maxCount = 10,
): ComplianceAlert | null {
  const accountIds = new Set(
    [...store.accounts.values()]
      .filter((a) => a.customerId === customerId)
      .map((a) => a.id),
  );
  const since = Date.now() - windowMs;
  let count = 0;
  for (const e of store.entries.values()) {
    if (!accountIds.has(e.accountId) || e.direction !== "debit") continue;
    const tx = store.transactions.get(e.transactionId);
    if (tx && tx.createdAt >= since) count++;
  }
  if (count <= maxCount) return null;
  return raiseAlert(store, {
    customerId,
    kind: "velocity",
    detail: `${count} outgoing transactions within ${Math.round(windowMs / 60000)} minutes`,
  });
}

export function openCase(
  store: InMemoryStore,
  input: { customerId: string; openedBy: { userId: string; role: Role } },
): ComplianceCase {
  const c: ComplianceCase = {
    id: nextId(store, "case"),
    customerId: input.customerId,
    status: "open",
    notes: [],
    createdAt: Date.now(),
  };
  store.cases.set(c.id, c);
  audit(store, {
    actorId: input.openedBy.userId,
    actorRole: input.openedBy.role,
    action: "case.open",
    target: c.id,
  });
  return c;
}

type CaseAction =
  | "assign"
  | "note"
  | "requestInfo"
  | "restrict"
  | "escalate"
  | "close";

/** Every case action is logged to the append-only audit trail. */
export function actOnCase(
  store: InMemoryStore,
  caseId: string,
  action: CaseAction,
  actor: { userId: string; role: Role },
  payload?: { note?: string },
): ComplianceCase {
  const c = store.cases.get(caseId);
  if (!c) throw new Error(`Unknown case ${caseId}`);
  switch (action) {
    case "assign":
      c.assigneeId = actor.userId;
      c.status = "assigned";
      break;
    case "note":
      c.notes.push({ by: actor.userId, text: payload?.note ?? "", at: Date.now() });
      break;
    case "requestInfo":
      c.status = "info_requested";
      break;
    case "restrict": {
      for (const a of store.accounts.values()) {
        if (a.customerId === c.customerId) a.status = "restricted";
      }
      break;
    }
    case "escalate":
      c.status = "escalated";
      break;
    case "close":
      c.status = "closed";
      break;
  }
  audit(store, {
    actorId: actor.userId,
    actorRole: actor.role,
    action: `case.${action}`,
    target: c.id,
    detail: payload?.note,
  });
  return c;
}
