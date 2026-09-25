import type { Metadata } from "next";
import Link from "next/link";
import { assignedCustomers } from "./lib";
import { tierLabel } from "@/lib/labels";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Relationship Manager" };

export default async function RmClientsPage() {
  const { customers } = await assignedCustomers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Your clients</h1>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
          Only clients assigned to you are shown. This portal has no
          fund-moving actions — payments require operations dual control.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {customers.map((c) => (
          <Link key={c.id} href={`/rm/clients/${c.id}`}>
            <Card className="p-5 transition-colors hover:bg-platinum-100/60 dark:hover:bg-navy-900/40">
              <p className="font-medium">{c.name}</p>
              <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
                {c.kind}, {tierLabel(c.tier)} tier
              </p>
              <div className="mt-3">
                <Badge
                  tone={
                    c.riskRating === "high"
                      ? "danger"
                      : c.riskRating === "medium"
                        ? "warning"
                        : "success"
                  }
                >
                  {c.riskRating ?? "unrated"} risk
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
        {customers.length === 0 ? (
          <p className="text-sm text-charcoal-500">No clients assigned.</p>
        ) : null}
      </div>
    </div>
  );
}
