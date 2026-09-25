import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/ui/Money";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";
import type { Currency } from "@/lib/money";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_audit")) return <Forbidden />;
  const store = getStore();
  ensureSeed(store);

  // Ledger integrity: per-currency sum(debits) must equal sum(credits).
  const sums = new Map<Currency, { debit: number; credit: number }>();
  for (const e of store.entries.values()) {
    const s = sums.get(e.currency) ?? { debit: 0, credit: 0 };
    s[e.direction] += e.amountMinor;
    sums.set(e.currency, s);
  }

  // Transfer volumes by status and currency.
  const volumes = new Map<string, number>();
  for (const t of store.transfers.values()) {
    const k = `${t.status}|${t.currency}`;
    volumes.set(k, (volumes.get(k) ?? 0) + t.amountMinor);
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium">Reports</h1>

      <section>
        <h2 className="font-display text-xl font-medium">Ledger integrity</h2>
        <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
          Computed live from every posting in the store.
        </p>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Currency</Th>
                <Th numeric>Total debits</Th>
                <Th numeric>Total credits</Th>
                <Th>Balanced</Th>
              </tr>
            </thead>
            <tbody>
              {[...sums.entries()].map(([cur, s]) => (
                <tr key={cur}>
                  <Td>{cur}</Td>
                  <Td numeric>
                    <Money amountMinor={s.debit} currency={cur} />
                  </Td>
                  <Td numeric>
                    <Money amountMinor={s.credit} currency={cur} />
                  </Td>
                  <Td>
                    <Badge tone={s.debit === s.credit ? "success" : "danger"}>
                      {s.debit === s.credit ? "Yes" : "Imbalanced"}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">
          Transfer volumes by status
        </h2>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Status</Th>
                <Th>Currency</Th>
                <Th numeric>Total amount</Th>
              </tr>
            </thead>
            <tbody>
              {[...volumes.entries()].map(([k, amt]) => {
                const [status, cur] = k.split("|") as [string, Currency];
                return (
                  <tr key={k}>
                    <Td>{status}</Td>
                    <Td>{cur}</Td>
                    <Td numeric>
                      <Money amountMinor={amt} currency={cur} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
