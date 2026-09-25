import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";
import type { KycApplication } from "@/server/types";

const TONE: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  Approved: "success",
  UnderReview: "info",
  AdditionalInfoRequired: "warning",
  Declined: "danger",
  Restricted: "danger",
};

/** Shared applications table for Applications / KYC / KYB lists. */
export function ApplicationList({ apps }: { apps: KycApplication[] }) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Application</Th>
            <Th>Applicant</Th>
            <Th>Kind</Th>
            <Th>Submitted</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id}>
              <Td>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="font-medium text-midnight-600 underline underline-offset-4 dark:text-champagne-500"
                >
                  {a.id}
                </Link>
              </Td>
              <Td>{a.applicantEmail}</Td>
              <Td>{a.kind}</Td>
              <Td>{new Date(a.createdAt).toLocaleDateString()}</Td>
              <Td>
                <Badge tone={TONE[a.status] ?? "neutral"}>{a.status}</Badge>
              </Td>
            </tr>
          ))}
          {apps.length === 0 ? (
            <tr>
              <Td colSpan={5} className="text-center text-charcoal-500">
                No applications.
              </Td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    </Card>
  );
}

export function kycVisible(
  canFn: (p: "review_kyc" | "view_compliance") => boolean,
): boolean {
  return canFn("review_kyc") || canFn("view_compliance");
}
