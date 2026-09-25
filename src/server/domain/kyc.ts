import { nextId, type InMemoryStore } from "../store";
import type { KycApplication, KycStatus } from "../types";

/** Allowed status transitions; approval always requires a reviewer action. */
const TRANSITIONS: Record<KycStatus, KycStatus[]> = {
  ApplicationStarted: ["DocumentsRequired", "Declined"],
  DocumentsRequired: ["UnderReview", "Declined"],
  UnderReview: ["AdditionalInfoRequired", "Approved", "Declined", "Restricted"],
  AdditionalInfoRequired: ["UnderReview", "Declined"],
  Approved: ["Restricted"],
  Declined: [],
  Restricted: ["Approved"],
};

export function createApplication(
  store: InMemoryStore,
  input: {
    kind: "individual" | "business";
    applicantEmail: string;
    data: Record<string, unknown>;
  },
): KycApplication {
  const app: KycApplication = {
    id: nextId(store, "kyc"),
    status: "ApplicationStarted",
    documents: [],
    createdAt: Date.now(),
    history: [{ status: "ApplicationStarted", at: Date.now() }],
    ...input,
  };
  store.kycApplications.set(app.id, app);
  return app;
}

export function transition(
  store: InMemoryStore,
  applicationId: string,
  to: KycStatus,
  by?: string,
): KycApplication {
  const app = store.kycApplications.get(applicationId);
  if (!app) throw new Error(`Unknown application ${applicationId}`);
  if (!TRANSITIONS[app.status].includes(to)) {
    throw new Error(`Cannot move application from ${app.status} to ${to}`);
  }
  if ((to === "Approved" || to === "Declined") && !by) {
    throw new Error("Approval or decline requires a reviewer action");
  }
  app.status = to;
  app.history.push({ status: to, at: Date.now(), by });
  return app;
}

export function addDocument(
  store: InMemoryStore,
  applicationId: string,
  doc: { name: string; type: string },
): KycApplication {
  const app = store.kycApplications.get(applicationId);
  if (!app) throw new Error(`Unknown application ${applicationId}`);
  app.documents.push({ ...doc, uploadedAt: Date.now() });
  return app;
}
