import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { piiMasked, maskEmail } from "@/server/pii";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_customer_profiles") && !can(role, "view_customer_profiles_masked")) {
    return <Forbidden />;
  }
  const masked = piiMasked(role);
  const store = getStore();
  ensureSeed(store);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Customers</h1>
      {masked ? (
        <p className="text-sm text-charcoal-500 dark:text-platinum-200">
          Personal details are masked for your role.
        </p>
      ) : null}
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Kind</Th>
              <Th>Tier</Th>
              <Th>Risk</Th>
              <Th>Primary user</Th>
            </tr>
          </thead>
          <tbody>
            {[...store.customers.values()].map((c) => {
              const user = [...store.users.values()].find(
                (u) => u.customerId === c.id,
              );
              return (
                <tr key={c.id}>
                  <Td>
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-medium text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
                    >
                      {c.name}
                    </Link>
                  </Td>
                  <Td>{c.kind}</Td>
                  <Td>{c.tier}</Td>
                  <Td>
                    <Badge
                      tone={
                        c.riskRating === "high"
                          ? "danger"
                          : c.riskRating === "medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {c.riskRating ?? "unrated"}
                    </Badge>
                  </Td>
                  <Td>{user ? (masked ? maskEmail(user.email) : user.email) : "—"}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
