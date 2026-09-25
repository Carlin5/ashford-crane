import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SupportForm } from "./SupportForm";

export const metadata: Metadata = { title: "Support" };

export default async function SupportPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const tickets = [...store.tickets.values()].filter(
    (t) => t.customerId === session.customerId,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Support</h1>
      <p className="rounded-lg border border-info-600/30 bg-info-600/5 p-3 text-sm text-charcoal-500 dark:text-platinum-200">
        Support staff see masked account details and cannot move your funds.
        Never share your password or authentication codes — we will never ask.
      </p>
      <Card className="p-6">
        <h2 className="font-medium">Open a ticket</h2>
        <SupportForm />
      </Card>
      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium">{t.subject}</p>
              <p className="text-xs text-charcoal-500 dark:text-platinum-200 tnum">
                {t.id}, {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge tone={t.status === "resolved" ? "success" : "warning"}>
              {statusLabel(t.status)}
            </Badge>
          </Card>
        ))}
        {tickets.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              No tickets yet.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
