import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RelativeTime } from "@/components/ui/RelativeTime";

export const metadata: Metadata = { title: "Security" };

export default async function SecurityPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(300);
  const sessions = [...store.sessions.values()].filter(
    (s) => s.userId === session.userId,
  );
  const devices = [...store.devices.values()].filter(
    (d) => d.userId === session.userId,
  );
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium">Security</h1>

      <section>
        <h2 className="font-display text-xl font-medium">Active sessions</h2>
        <div className="mt-4 space-y-3">
          {sessions.map((s) => (
            <Card key={s.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium">{s.deviceLabel}</p>
                <p className="text-xs text-charcoal-500 dark:text-platinum-200">
                  {s.ip}, signed in <RelativeTime at={s.createdAt} />
                </p>
              </div>
              {s.current ? <Badge tone="success">This session</Badge> : null}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Devices</h2>
        <div className="mt-4 space-y-3">
          {devices.map((d) => (
            <Card key={d.id} className="flex items-center justify-between p-5">
              <p className="text-sm font-medium">{d.label}</p>
              <RelativeTime at={d.lastSeenAt} prefix="last seen" />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Authentication</h2>
        <Card className="mt-4 p-5">
          <p className="text-sm">
            Multi-factor authentication is <Badge tone="success">On</Badge> for
            sign-in and for moving money. Passkeys are available where your
            device supports them.
          </p>
          <p className="mt-3 text-sm text-charcoal-500 dark:text-platinum-200">
            You are notified by email on every sign-in from a new device.
          </p>
        </Card>
      </section>
    </div>
  );
}
