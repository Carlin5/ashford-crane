import { Card } from "@/components/ui/Card";

/** Rendered in place of a page's content when RBAC denies access. */
export function Forbidden() {
  return (
    <Card className="mx-auto mt-16 max-w-md p-8 text-center">
      <h1 className="font-display text-2xl font-medium">403 — No access</h1>
      <p className="mt-3 text-sm text-charcoal-500 dark:text-platinum-200">
        Your role does not have permission to view this section. If you believe
        you should have access, contact your administrator.
      </p>
    </Card>
  );
}
