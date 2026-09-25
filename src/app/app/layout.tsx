import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { AppShell } from "@/components/app/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.userId || session.mfa !== "complete" || session.role !== "client") {
    redirect("/login");
  }
  return (
    <AppShell name={session.name ?? "Client"} email={session.email ?? ""}>
      {children}
    </AppShell>
  );
}
