import { statusLabel } from "@/lib/labels";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { piiMasked, maskKycData } from "@/server/pii";
import { kycAction } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Forbidden } from "@/components/admin/Forbidden";
import type { KycStatus } from "@/server/types";

export const metadata: Metadata = { title: "Application" };

const ACTIONS: { to: KycStatus; label: string }[] = [
  { to: "Approved", label: "Approve" },
  { to: "Declined", label: "Decline" },
  { to: "AdditionalInfoRequired", label: "Request more information" },
  { to: "Restricted", label: "Restrict" },
];

export default async function ApplicationDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "review_kyc") && !can(role, "view_compliance")) {
    return <Forbidden />;
  }
  const { id } = await params;
  const { error } = await searchParams;
  const store = getStore();
  ensureSeed(store);
  const app = store.kycApplications.get(id);
  if (!app) notFound();

  const reviewer = can(role, "review_kyc");
  const data = maskKycData(app.data, piiMasked(role));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">{app.id}</h1>
        <Badge tone={app.status === "Approved" ? "success" : "info"}>
          {statusLabel(app.status)}
        </Badge>
        <Badge tone="neutral">{app.kind}</Badge>
      </div>
      {error ? (
        <p className="rounded-lg border border-danger-600/40 bg-danger-600/5 p-3 text-sm text-danger-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-xl font-medium">Applicant details</h2>
        <Card className="mt-3 p-5">
          <p className="mb-3 text-sm">
            <span className="text-charcoal-500 dark:text-platinum-200">
              Email:{" "}
            </span>
            {app.applicantEmail}
          </p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries(data).map(([k, v]) => (
              <div key={k}>
                <dt className="text-charcoal-500 dark:text-platinum-200">{k}</dt>
                <dd>{String(v)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Documents</h2>
        <div className="mt-3 space-y-2">
          {app.documents.length === 0 ? (
            <p className="text-sm text-charcoal-500">None uploaded.</p>
          ) : (
            app.documents.map((d, i) => (
              <Card
                key={i}
                className="flex items-center justify-between p-4 text-sm"
              >
                <span>{d.name}</span>
                <span className="text-charcoal-500 dark:text-platinum-200">
                  {d.type}, {new Date(d.uploadedAt).toLocaleDateString()}
                </span>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">History</h2>
        <div className="mt-3 space-y-2">
          {app.history.map((h, i) => (
            <Card key={i} className="flex items-center justify-between p-4 text-sm">
              <span>{statusLabel(h.status)}</span>
              <span className="text-charcoal-500 dark:text-platinum-200">
                {new Date(h.at).toLocaleString()}
                {h.by ? `, by ${h.by}` : ""}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {reviewer ? (
        <section>
          <h2 className="font-display text-xl font-medium">Review actions</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {ACTIONS.map((a) => (
              <form
                key={a.to}
                action={async () => {
                  "use server";
                  const r = await kycAction(app.id, a.to);
                  if (r.error) {
                    const { redirect } = await import("next/navigation");
                    redirect(
                      `/admin/applications/${app.id}?error=${encodeURIComponent(r.error)}`,
                    );
                  }
                }}
              >
                <Button
                  type="submit"
                  variant={a.to === "Approved" ? "primary" : "secondary"}
                >
                  {a.label}
                </Button>
              </form>
            ))}
          </div>
          <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
            Every review decision is recorded in the audit log; applications are
            never auto-approved.
          </p>
        </section>
      ) : (
        <p className="text-sm text-charcoal-500 dark:text-platinum-200">
          Your role has read-only access to applications.
        </p>
      )}
    </div>
  );
}
