import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);

  const appsByStatus = new Map<string, number>();
  for (const a of store.kycApplications.values()) {
    appsByStatus.set(a.status, (appsByStatus.get(a.status) ?? 0) + 1);
  }
  const openAlerts = [...store.alerts.values()].filter(
    (a) => a.status === "open",
  ).length;
  const pendingTransfers = [...store.transfers.values()].filter(
    (t) => t.status === "PendingVerification",
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">Dashboard</h1>
        <Badge tone="champagne">{session.role?.replaceAll("_", " ")}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-3xl font-medium">{pendingTransfers}</p>
          <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
            Transfers pending approval
          </p>
          <Link
            href="/admin/transfers"
            className="mt-2 inline-block text-sm text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
          >
            Review queue
          </Link>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-medium">{openAlerts}</p>
          <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
            Open compliance alerts
          </p>
          <Link
            href="/admin/compliance/alerts"
            className="mt-2 inline-block text-sm text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
          >
            View alerts
          </Link>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-medium">
            {[...appsByStatus.values()].reduce((a, b) => a + b, 0)}
          </p>
          <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
            Onboarding applications
          </p>
          <Link
            href="/admin/applications"
            className="mt-2 inline-block text-sm text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
          >
            View applications
          </Link>
        </Card>
      </div>

      <section>
        <h2 className="font-display text-xl font-medium">
          Applications by status
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {appsByStatus.size === 0 ? (
            <p className="text-sm text-charcoal-500">None yet.</p>
          ) : (
            [...appsByStatus.entries()].map(([status, n]) => (
              <Card key={status} className="px-4 py-3">
                <span className="text-lg font-medium">{n}</span>{" "}
                <span className="text-sm text-charcoal-500 dark:text-platinum-200">
                  {status}
                </span>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Provider health</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(store.providerHealth).map(([name, status]) => (
            <Card key={name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-medium">{name}</span>
              <Badge tone={status === "up" ? "success" : "danger"}>
                {status === "up" ? "Up" : "Down"}
              </Badge>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
          Toggles live under System Settings.
        </p>
      </section>
    </div>
  );
}
