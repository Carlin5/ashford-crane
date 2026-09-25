import "server-only";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import type { Customer } from "@/server/types";

/** The customers assigned to the signed-in RM (empty for other staff). */
export async function assignedCustomers(): Promise<{
  userId: string;
  customers: Customer[];
  assignedIds: string[];
}> {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  const user = [...store.users.values()].find((u) => u.id === session.userId);
  const assignedIds = user?.assignedCustomerIds ?? [];
  const customers = assignedIds
    .map((id) => store.customers.get(id))
    .filter((c): c is Customer => Boolean(c));
  return { userId: session.userId!, customers, assignedIds };
}
