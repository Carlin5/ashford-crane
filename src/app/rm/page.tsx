import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Relationship Manager" };

/** RM portal placeholder: assigned clients only, no fund movement. */
export default async function RmPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  const user = [...store.users.values()].find((u) => u.id === session.userId);
  const assigned = (user?.assignedCustomerIds ?? [])
    .map((id) => store.customers.get(id))
    .filter(Boolean);
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">
          Relationship manager portal
        </h1>
        <Badge tone="champagne">{session.role}</Badge>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-charcoal-500 dark:text-platinum-200">
        You see only your assigned clients and cannot move client funds — any
        financial action requires the same dual-control authorization as
        operations. The full portal arrives in a later phase.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {assigned.map((c) => (
          <Card key={c!.id} className="p-5">
            <p className="font-medium">{c!.name}</p>
            <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
              {c!.kind} · {c!.tier} tier
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
