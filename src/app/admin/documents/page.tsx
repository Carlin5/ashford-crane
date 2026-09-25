import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { can } from "@/server/domain/rbac";
import { piiMasked, maskEmail } from "@/server/pii";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td } from "@/components/ui/Table";
import { Forbidden } from "@/components/admin/Forbidden";

export const metadata: Metadata = { title: "Documents" };

export default async function AdminDocuments() {
  const session = await getSession();
  const role = session.role!;
  if (!can(role, "review_kyc") && !can(role, "view_compliance")) {
    return <Forbidden />;
  }
  const masked = piiMasked(role);
  const store = getStore();
  ensureSeed(store);
  const rows = [...store.kycApplications.values()].flatMap((a) =>
    a.documents.map((d) => ({ app: a, doc: d })),
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Documents</h1>
      <p className="text-sm text-charcoal-500 dark:text-platinum-200">
        Uploads are stored as metadata only in the sandbox.
      </p>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Document</Th>
              <Th>Type</Th>
              <Th>Application</Th>
              <Th>Applicant</Th>
              <Th>Uploaded</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <Td>{r.doc.name}</Td>
                <Td>
                  <Badge tone="neutral">{r.doc.type}</Badge>
                </Td>
                <Td>{r.app.id}</Td>
                <Td>{masked ? maskEmail(r.app.applicantEmail) : r.app.applicantEmail}</Td>
                <Td>{new Date(r.doc.uploadedAt).toLocaleDateString()}</Td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <Td colSpan={5} className="text-center text-charcoal-500">
                  No documents.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
