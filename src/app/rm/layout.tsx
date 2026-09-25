import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { RmShell } from "@/components/rm/RmShell";

export default async function RmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (
    !session.userId ||
    session.mfa !== "complete" ||
    (session.role !== "relationship_manager" && session.role !== "super_admin")
  ) {
    redirect("/login");
  }
  return (
    <RmShell name={session.name ?? "RM"} email={session.email ?? ""}>
      {children}
    </RmShell>
  );
}
