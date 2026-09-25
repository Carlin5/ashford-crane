import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { ApplicationList } from "@/components/admin/ApplicationList";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "KYB" };

export default async function KybPage() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "review_kyc") && !can(role, "view_compliance")) {
    return <Forbidden />;
  }
  const store = getStore();
  ensureSeed(store);
  const apps = [...store.kycApplications.values()]
    .filter((a) => a.kind === "business")
    .sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">KYB — businesses</h1>
      <ApplicationList apps={apps} />
    </div>
  );
}
