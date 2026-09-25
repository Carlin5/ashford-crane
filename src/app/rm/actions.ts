"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/server/auth";
import { getStore, nextId } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { audit } from "@/server/domain/audit";
import { notifyCustomer } from "@/server/domain/notifications";

type Result = { error?: string };

async function rmActor(): Promise<
  { userId: string; assigned: string[] } | { error: string }
> {
  const s = await getSession();
  if (!s.userId || s.mfa !== "complete") return { error: "Sign in required." };
  if (s.role !== "relationship_manager" && s.role !== "super_admin") {
    return { error: "Relationship manager role required." };
  }
  const store = getStore();
  ensureSeed(store);
  const user = [...store.users.values()].find((u) => u.id === s.userId);
  return { userId: s.userId, assigned: user?.assignedCustomerIds ?? [] };
}

/** RMs cannot edit customer data — only request the edit via operations. */
export async function requestCustomerEdit(
  customerId: string,
  formData: FormData,
): Promise<Result> {
  const a = await rmActor();
  if ("error" in a) return { error: a.error };
  if (!a.assigned.includes(customerId)) {
    return { error: "This customer is not assigned to you." };
  }
  const detail = String(formData.get("detail") ?? "").trim();
  if (!detail) return { error: "Describe the requested change." };
  const store = getStore();
  const id = nextId(store, "tkt");
  store.tickets.set(id, {
    id,
    customerId,
    subject: `RM edit request — ${detail}`,
    status: "open",
    createdAt: Date.now(),
  });
  audit(store, {
    actorId: a.userId,
    actorRole: "relationship_manager",
    action: "customer.edit_requested",
    target: customerId,
    detail,
  });
  revalidatePath("/rm/requests");
  return {};
}

export async function replyToThread(
  threadId: string,
  formData: FormData,
): Promise<Result> {
  const a = await rmActor();
  if ("error" in a) return { error: a.error };
  const store = getStore();
  const thread = store.threads.get(threadId);
  if (!thread || !a.assigned.includes(thread.customerId)) {
    return { error: "Thread not found." };
  }
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return { error: "Message cannot be empty." };
  thread.messages.push({ from: "staff", text, at: Date.now() });
  audit(store, {
    actorId: a.userId,
    actorRole: "relationship_manager",
    action: "message.reply",
    target: threadId,
  });
  notifyCustomer(store, {
    customerId: thread.customerId,
    kind: "message",
    text: `New message in "${thread.subject}".`,
  });
  revalidatePath("/rm/messages");
  return {};
}
