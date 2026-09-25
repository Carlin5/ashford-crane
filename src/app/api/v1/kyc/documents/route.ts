import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { errorEnvelope, parseBody, requireSession } from "@/server/api";
import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { addDocument } from "@/server/domain/kyc";
import { audit } from "@/server/domain/audit";

const schema = z.object({
  applicationId: z.string(),
  name: z.string().min(1),
  type: z.string().min(1),
});

/** Document upload recorded as metadata only — no file storage in sandbox. */
export async function POST(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  const store = getStore();
  ensureSeed(store);
  const app = store.kycApplications.get(body.applicationId);
  if (!app || app.applicantEmail !== session.email) {
    return errorEnvelope(404, "not_found", "Application not found.");
  }
  addDocument(store, app.id, { name: body.name, type: body.type });
  audit(store, {
    actorId: session.userId, actorRole: session.role,
    action: "kyc.document", target: app.id, detail: body.name,
  });
  return NextResponse.json({ application: app }, { status: 201 });
}
