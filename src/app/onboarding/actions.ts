"use server";

import { getStore } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import {
  addDocument,
  createApplication,
  transition,
} from "@/server/domain/kyc";
import { audit } from "@/server/domain/audit";

export type ApplicationInput = {
  kind: "individual" | "business";
  applicantEmail: string;
  data: Record<string, unknown>;
  documents: { name: string; type: string }[];
};

export async function submitApplication(input: ApplicationInput) {
  const store = getStore();
  ensureSeed(store);
  const app = createApplication(store, {
    kind: input.kind,
    applicantEmail: input.applicantEmail,
    data: input.data,
  });
  for (const doc of input.documents) {
    addDocument(store, app.id, doc);
  }
  transition(store, app.id, "DocumentsRequired");
  transition(store, app.id, "UnderReview", "applicant-submission");
  audit(store, {
    actorId: input.applicantEmail,
    actorRole: "client",
    action: "kyc.application_submitted",
    target: app.id,
  });
  return { id: app.id, status: app.status };
}
