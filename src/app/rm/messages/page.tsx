import type { Metadata } from "next";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { assignedCustomers } from "@/app/rm/lib";
import { replyToThread } from "@/app/rm/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = { title: "Messages" };

export default async function RmMessages() {
  const { assignedIds } = await assignedCustomers();
  const store = getStore();
  ensureSeed(store);
  const threads = [...store.threads.values()].filter((t) =>
    assignedIds.includes(t.customerId),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Secure messages</h1>
      {threads.length === 0 ? (
        <p className="text-sm text-charcoal-500">No threads.</p>
      ) : (
        threads.map((t) => (
          <Card key={t.id} className="p-5">
            <p className="font-medium">{t.subject}</p>
            <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
              {store.customers.get(t.customerId)?.name}
            </p>
            <div className="mt-4 space-y-3">
              {t.messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-sm ${
                    m.from === "staff"
                      ? "ml-8 bg-navy-900 text-platinum-100"
                      : "mr-8 bg-platinum-100 dark:bg-navy-700"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {m.from === "staff" ? "You" : "Client"},{" "}
                    {new Date(m.at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <form
              action={async (fd) => {
                "use server";
                await replyToThread(t.id, fd);
              }}
              className="mt-4 flex gap-2"
            >
              <Input name="text" placeholder="Reply" required />
              <Button type="submit" variant="secondary">
                Send
              </Button>
            </form>
          </Card>
        ))
      )}
    </div>
  );
}
