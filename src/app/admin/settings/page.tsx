import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { addJurisdiction, setProviderHealth } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";
import { FEE_SCHEDULE, TRANSFER_FEES, FX_SPREAD_BPS } from "@/../config/fees";
import { TIERS } from "@/../config/tiers";

export const metadata: Metadata = { title: "System Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  const configureSystem = can(role, "configure_system");
  const configureFees = can(role, "configure_fees");
  const manageUsers = can(role, "manage_users");
  if (!configureSystem && !configureFees && !manageUsers) {
    return <Forbidden />;
  }
  const { error } = await searchParams;
  const store = getStore();
  ensureSeed(store);

  async function toggle(provider: string, status: "up" | "down") {
    "use server";
    const r = await setProviderHealth(provider, status);
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(`/admin/settings?error=${encodeURIComponent(r.error)}`);
    }
  }
  async function addRow(formData: FormData) {
    "use server";
    const r = await addJurisdiction(formData);
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(`/admin/settings?error=${encodeURIComponent(r.error)}`);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium">System settings</h1>
      {error ? (
        <p className="rounded-lg border border-danger-600/40 bg-danger-600/5 p-3 text-sm text-danger-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-medium">Fee schedule</h2>
        <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
          Read from configuration; Finance Officers see this section only.
        </p>
        <Card className="mt-3">
          <Table>
            <thead>
              <tr>
                <Th>Category</Th>
                <Th>Model</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody>
              {FEE_SCHEDULE.map((f) => (
                <tr key={f.category}>
                  <Td>{f.category}</Td>
                  <Td>{f.model}</Td>
                  <Td>{f.note ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card className="mt-3 p-5 text-sm">
          <p>
            Transfer fee (default corridor): {TRANSFER_FEES.default.flatMinor}{" "}
            minor units flat + {TRANSFER_FEES.default.percentBps} bps. FX
            spread: {FX_SPREAD_BPS} bps.
          </p>
        </Card>
      </section>

      {configureSystem ? (
        <>
          <section>
            <h2 className="font-display text-xl font-medium">Tiers</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {TIERS.map((t) => (
                <Card key={t.id} className="p-5">
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
                    {t.designedFor}
                  </p>
                  <ul className="mt-2 list-inside list-disc text-sm">
                    {t.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium">
              Jurisdiction availability
            </h2>
            <Card className="mt-3">
              <Table>
                <thead>
                  <tr>
                    <Th>Country</Th>
                    <Th>Services</Th>
                    <Th>Onboarding</Th>
                    <Th>Notes</Th>
                  </tr>
                </thead>
                <tbody>
                  {store.jurisdictions.map((j, i) => (
                    <tr key={`${j.country}-${i}`}>
                      <Td>{j.country}</Td>
                      <Td className="max-w-xs">{j.servicesAvailable}</Td>
                      <Td className="max-w-xs">{j.onboardingStatus}</Td>
                      <Td className="max-w-xs">{j.regulatoryNotes}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
            <form
              action={addRow}
              className="mt-3 flex flex-wrap items-end gap-3"
            >
              <Input name="country" label="Country" required />
              <Input name="servicesAvailable" label="Services" />
              <Input name="onboardingStatus" label="Onboarding status" />
              <Input name="regulatoryNotes" label="Notes" />
              <Button type="submit" variant="secondary">
                Add row
              </Button>
            </form>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium">
              Provider health
            </h2>
            <p className="mt-1 text-sm text-charcoal-500 dark:text-platinum-200">
              Flipping a provider down surfaces degraded-mode messaging in the
              client app.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(store.providerHealth).map(([name, status]) => (
                <Card
                  key={name}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <Badge tone={status === "up" ? "success" : "danger"}>
                      {status}
                    </Badge>
                  </div>
                  <form
                    action={toggle.bind(
                      null,
                      name,
                      status === "up" ? "down" : "up",
                    )}
                  >
                    <Button type="submit" variant="secondary">
                      Set {status === "up" ? "down" : "up"}
                    </Button>
                  </form>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {manageUsers ? (
        <section>
          <h2 className="font-display text-xl font-medium">Users &amp; roles</h2>
          <Card className="mt-3">
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Customer</Th>
                </tr>
              </thead>
              <tbody>
                {[...store.users.values()].map((u) => (
                  <tr key={u.id}>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <Badge tone="neutral">{u.role.replaceAll("_", " ")}</Badge>
                    </Td>
                    <Td>{u.customerId ?? "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
