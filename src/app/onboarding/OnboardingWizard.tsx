"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { PENDING } from "@/lib/compliance";
import { JURISDICTIONS } from "@/../config/jurisdictions";
import { submitApplication } from "./actions";

const STEPS = [
  { id: "jurisdiction", label: "Jurisdiction" },
  { id: "type", label: "Account type" },
  { id: "details", label: "Details" },
  { id: "tax", label: "Tax residency" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
];

type Doc = { name: string; type: string };

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<"individual" | "business">("individual");
  const [jurisdiction, setJurisdiction] = useState("");
  const [data, setData] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docName, setDocName] = useState("");
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const jurRow = JURISDICTIONS.find((j) => j.country === jurisdiction);

  function set(field: string) {
    return (e: { target: { value: string } }) =>
      setData((d) => ({ ...d, [field]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await submitApplication({
      kind,
      applicantEmail: data.email ?? "applicant@example.test",
      data: { ...data, jurisdiction, kind },
      documents: docs,
    });
    setBusy(false);
    setSubmitted(result);
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] border border-platinum-200 p-8 dark:border-navy-700">
        <h2 className="font-display text-2xl font-medium">
          Application submitted
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Reference <span className="tnum font-medium">{submitted.id}</span>.
          Your application is now <strong>Under review</strong>. A reviewer
          will complete identity, sanctions, and screening checks — approval
          is never automatic just because documents were uploaded. We&apos;ll
          notify you of the outcome or if we need additional information.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] border border-platinum-200 p-6 dark:border-navy-700 md:p-8">
      <Stepper steps={STEPS} currentIndex={step} />
      <div className="mt-10">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">
              Where are you based?
            </h2>
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              We check jurisdiction first so applicants from countries we
              cannot yet serve are told clearly up front.
            </p>
            <Select
              label="Country or region"
              name="jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              required
            >
              <option value="">Select…</option>
              {JURISDICTIONS.map((j) => (
                <option key={j.country} value={j.country}>
                  {j.country}
                </option>
              ))}
            </Select>
            {jurRow ? (
              <p className="rounded-lg border border-info-600/30 bg-info-600/5 p-4 text-sm text-charcoal-500 dark:text-platinum-200">
                Onboarding status for {jurRow.country}: {jurRow.onboardingStatus}
                {jurRow.onboardingStatus === PENDING
                  ? " You may continue this demo application; real availability is confirmed separately."
                  : ""}
              </p>
            ) : null}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">Account type</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["individual", "Individual", "A personal account in your own name."],
                  ["business", "Business", "An account for a company or organization."],
                ] as const
              ).map(([value, title, desc]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  aria-pressed={kind === value}
                  className={`rounded-[var(--radius-card)] border p-5 text-start transition-colors ${
                    kind === value
                      ? "border-champagne-500 bg-champagne-500/5"
                      : "border-platinum-200 dark:border-navy-700"
                  }`}
                >
                  <span className="font-medium">{title}</span>
                  <span className="mt-1 block text-sm text-charcoal-500 dark:text-platinum-200">
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">
              {kind === "individual" ? "Your details" : "Business details"}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {kind === "individual" ? (
                <>
                  <Input label="Full legal name" name="fullName" value={data.fullName ?? ""} onChange={set("fullName")} required />
                  <Input label="Date of birth" name="dob" type="date" value={data.dob ?? ""} onChange={set("dob")} required />
                  <Input label="Nationality" name="nationality" value={data.nationality ?? ""} onChange={set("nationality")} required />
                  <Input label="Residential address" name="address" value={data.address ?? ""} onChange={set("address")} required />
                </>
              ) : (
                <>
                  <Input label="Company name" name="companyName" value={data.companyName ?? ""} onChange={set("companyName")} required />
                  <Input label="Registration number" name="regNumber" value={data.regNumber ?? ""} onChange={set("regNumber")} required />
                  <Input label="Incorporation country" name="incCountry" value={data.incCountry ?? ""} onChange={set("incCountry")} required />
                  <Input label="Registered address" name="regAddress" value={data.regAddress ?? ""} onChange={set("regAddress")} required />
                  <Input label="Business activity" name="activity" value={data.activity ?? ""} onChange={set("activity")} required />
                  <Input label="Directors & beneficial owners" name="owners" value={data.owners ?? ""} onChange={set("owners")} required />
                </>
              )}
              <Input label="Email" name="email" type="email" value={data.email ?? ""} onChange={set("email")} required />
              <Input label="Phone" name="phone" type="tel" value={data.phone ?? ""} onChange={set("phone")} required />
              <Input label="Source of funds" name="sourceOfFunds" value={data.sourceOfFunds ?? ""} onChange={set("sourceOfFunds")} required />
              <Input label="Source of wealth" name="sourceOfWealth" value={data.sourceOfWealth ?? ""} onChange={set("sourceOfWealth")} required />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">
              Tax residency self-certification
            </h2>
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              Required for CRS/FATCA reporting once operating under a real
              regulated partner.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Country of tax residence" name="taxResidence" value={data.taxResidence ?? ""} onChange={set("taxResidence")} required />
              <Input label="Tax identification number (if issued)" name="tin" value={data.tin ?? ""} onChange={set("tin")} />
            </div>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="taxCertify" required className="mt-1" />
              <span>
                I certify that the tax residency information provided is true
                and complete, and I will notify Ashford &amp; Crane of any
                change.
              </span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">Documents</h2>
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              In this demo, documents are recorded as metadata only — nothing
              is stored.
            </p>
            <div className="flex gap-3">
              <Input
                label="Document description"
                name="docName"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g., Passport bio page"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                className="self-end"
                onClick={() => {
                  if (docName.trim()) {
                    setDocs((d) => [...d, { name: docName.trim(), type: "identity" }]);
                    setDocName("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            {docs.length ? (
              <ul className="list-disc space-y-1 ps-5 text-sm text-charcoal-500 dark:text-platinum-200">
                {docs.map((d, i) => (
                  <li key={i}>{d.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-500 dark:text-platinum-200">
                No documents added yet.
              </p>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-medium">Review</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="font-medium">Account type</dt><dd className="text-charcoal-500 dark:text-platinum-200">{kind}</dd></div>
              <div><dt className="font-medium">Jurisdiction</dt><dd className="text-charcoal-500 dark:text-platinum-200">{jurisdiction}</dd></div>
              <div><dt className="font-medium">Documents</dt><dd className="text-charcoal-500 dark:text-platinum-200">{docs.length} recorded</dd></div>
              <div><dt className="font-medium">Tax residence</dt><dd className="text-charcoal-500 dark:text-platinum-200">{data.taxResidence}</dd></div>
            </dl>
            <p className="text-sm text-charcoal-500 dark:text-platinum-200">
              Submitting moves your application to Under review. Approval
              requires a completed reviewer check — it is never automatic.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !jurisdiction}
          >
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={busy}>
            {busy ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </form>
  );
}
