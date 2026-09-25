import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { cardAction } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Cards" };

export default async function AdminCards({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "freeze_cards")) {
    return <Forbidden />;
  }
  const { error } = await searchParams;
  const store = getStore();
  ensureSeed(store);
  const support = role === "customer_support";

  async function act(cardId: string, op: "freeze" | "unfreeze") {
    "use server";
    const r = await cardAction(cardId, op);
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(`/admin/cards?error=${encodeURIComponent(r.error)}`);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Cards</h1>
      {support ? (
        <p className="text-sm text-charcoal-500 dark:text-platinum-200">
          Support agents may freeze cards only; unfreeze requires a different
          role.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-danger-600/40 bg-danger-600/5 p-3 text-sm text-danger-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Card</Th>
              <Th>Customer</Th>
              <Th>Account</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {[...store.cards.values()].map((c) => {
              const frozen = c.status === "frozen";
              return (
                <tr key={c.id}>
                  <Td>
                    {c.label} •••• {c.last4}
                  </Td>
                  <Td>{store.customers.get(c.customerId)?.name}</Td>
                  <Td>{store.accounts.get(c.accountId)?.identifier}</Td>
                  <Td>
                    <Badge tone={frozen ? "warning" : "success"}>{statusLabel(c.status)}</Badge>
                  </Td>
                  <Td>
                    <form action={act.bind(null, c.id, frozen ? "unfreeze" : "freeze")}>
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={frozen && support}
                      >
                        {frozen ? "Unfreeze" : "Freeze"}
                      </Button>
                    </form>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
