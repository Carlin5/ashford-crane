import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const apps = [...store.kycApplications.values()].filter(
    (a) => a.applicantEmail === session.email,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Documents</h1>
      <p className="max-w-2xl text-sm text-charcoal-500 dark:text-platinum-200">
        Statements and reports live here, including documents from wealth
        partners through the same vault.
      </p>
      {apps.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-charcoal-500 dark:text-platinum-200">
            No documents yet — onboarding documents and statements will appear
            here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {apps.flatMap((a) =>
            a.documents.length === 0
              ? [
                  <Card key={a.id} className="flex items-center justify-between p-5">
                    <p className="text-sm text-charcoal-500 dark:text-platinum-200">
                      Application {a.id} — no documents recorded yet.
                    </p>
                    <Badge tone="warning">{a.status}</Badge>
                  </Card>,
                ]
              : a.documents.map((d, i) => (
                  <Card key={`${a.id}-${i}`} className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                        {a.id}, {new Date(d.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge tone="neutral">{d.type}</Badge>
                  </Card>
                )),
          )}
        </div>
      )}
    </div>
  );
}
