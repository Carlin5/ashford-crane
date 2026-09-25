import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { STAFF_ROLES } from "@/server/types";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (
    !session.userId ||
    session.mfa !== "complete" ||
    !session.role ||
    !STAFF_ROLES.includes(session.role)
  ) {
    redirect("/login");
  }
  if (session.role === "relationship_manager") {
    redirect("/rm");
  }
  return (
    <AdminShell
      name={session.name ?? "Staff"}
      email={session.email ?? ""}
      role={session.role}
    >
      {children}
    </AdminShell>
  );
}
