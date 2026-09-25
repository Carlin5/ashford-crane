import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const threads = [...store.threads.values()].filter(
    (t) => t.customerId === session.customerId,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Messages</h1>
      <p className="rounded-lg border border-info-600/30 bg-info-600/5 p-3 text-sm text-charcoal-500 dark:text-platinum-200">
        Secure messaging with your banking team. We will never ask for your
        password, full card security code, or authentication codes here.
      </p>
      {threads.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-charcoal-500 dark:text-platinum-200">
            No conversations yet — start one with your relationship team.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {threads.map((t) => (
            <Card key={t.id} className="p-5">
              <h2 className="font-medium">{t.subject}</h2>
              <div className="mt-4 space-y-3">
                {t.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-md rounded-lg p-3 text-sm ${
                      m.from === "client"
                        ? "ms-auto bg-navy-900 text-white"
                        : "bg-platinum-100 text-charcoal-900 dark:bg-navy-700 dark:text-platinum-100"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
