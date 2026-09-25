import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { caseAction } from "@/app/admin/actions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Case" };

const SIMPLE_ACTIONS = [
  { action: "assign" as const, label: "Assign to me" },
  { action: "requestInfo" as const, label: "Request information" },
  { action: "restrict" as const, label: "Restrict customer accounts" },
  { action: "escalate" as const, label: "Escalate" },
  { action: "close" as const, label: "Close case" },
];

export default async function CaseDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "view_compliance")) return <Forbidden />;
  const { id } = await params;
  const { error } = await searchParams;
  const store = getStore();
  ensureSeed(store);
  const c = store.cases.get(id);
  if (!c) notFound();
  const customer = store.customers.get(c.customerId);
  const canManage = can(role, "manage_cases");
  const canEscalate = can(role, "escalate_cases") || canManage;

  async function act(
    action: "assign" | "note" | "requestInfo" | "restrict" | "escalate" | "close",
    formData?: FormData,
  ) {
    "use server";
    const r = await caseAction(id, action, String(formData?.get("note") ?? ""));
    if (r.error) {
      const { redirect } = await import("next/navigation");
      redirect(
        `/admin/compliance/cases/${id}?error=${encodeURIComponent(r.error)}`,
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-medium">{c.id}</h1>
        <Badge tone={c.status === "closed" ? "success" : "warning"}>
          {c.status.replaceAll("_", " ")}
        </Badge>
      </div>
      {error ? (
        <p className="rounded-lg border border-danger-600/40 bg-danger-600/5 p-3 text-sm text-danger-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}

      <Card className="p-5 text-sm">
        <p>
          <span className="text-charcoal-500 dark:text-platinum-200">
            Customer:{" "}
          </span>
          {customer?.name} ({c.customerId})
        </p>
        <p className="mt-2">
          <span className="text-charcoal-500 dark:text-platinum-200">
            Opened:{" "}
          </span>
          {new Date(c.createdAt).toLocaleString()}
        </p>
        <p className="mt-2">
          <span className="text-charcoal-500 dark:text-platinum-200">
            Assignee:{" "}
          </span>
          {c.assigneeId ?? "unassigned"}
        </p>
      </Card>

      <section>
        <h2 className="font-display text-xl font-medium">Notes</h2>
        <div className="mt-3 space-y-2">
          {c.notes.length === 0 ? (
            <p className="text-sm text-charcoal-500">No notes yet.</p>
          ) : (
            c.notes.map((n, i) => (
              <Card key={i} className="p-4 text-sm">
                <p>{n.text}</p>
                <p className="mt-1 text-xs text-charcoal-500 dark:text-platinum-200">
                  {n.by}, {new Date(n.at).toLocaleString()}
                </p>
              </Card>
            ))
          )}
        </div>
        {canManage ? (
          <form action={act.bind(null, "note")} className="mt-3 flex gap-2">
            <Input name="note" placeholder="Add a note" required />
            <Button type="submit" variant="secondary">
              Add note
            </Button>
          </form>
        ) : null}
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {SIMPLE_ACTIONS.filter(
            (a) =>
              (a.action === "escalate" ? canEscalate : canManage) &&
              !(a.action === "close" && c.status === "closed"),
          ).map((a) => (
            <form key={a.action} action={act.bind(null, a.action)}>
              <Button
                type="submit"
                variant={a.action === "close" ? "primary" : "secondary"}
              >
                {a.label}
              </Button>
            </form>
          ))}
          {!canManage && !canEscalate ? (
            <p className="text-sm text-charcoal-500">Read-only for your role.</p>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
          Every action is written to the audit log.
        </p>
      </section>
    </div>
  );
}
