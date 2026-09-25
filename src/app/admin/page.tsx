import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Admin" };

/**
 * Admin portal shell. The full portal (customers, KYC, compliance, reports,
 * system settings with RBAC per page) is a later phase; access here is
 * already role-gated by middleware + this page's role check.
 */
export default async function AdminPage() {
  const session = await getSession();
  const sections = [
    "Dashboard", "Customers", "Applications", "KYC", "KYB", "Accounts",
    "Transactions", "Cards", "Transfers", "Compliance", "Documents",
    "Support", "Reports", "Audit Logs", "System Settings",
  ];
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">Admin portal</h1>
        <Badge tone="champagne">{session.role}</Badge>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-charcoal-500 dark:text-platinum-200">
        Signed in as {session.email}. Each section below will enforce its own
        permission check and render 403 where your role lacks access — this
        page is the Phase B placeholder while the portal is built out.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sections.map((s) => (
          <Card key={s} className="p-5 text-sm font-medium text-charcoal-500 dark:text-platinum-200">
            {s}
          </Card>
        ))}
      </div>
    </div>
  );
}
