import type { Metadata } from "next";
import { PENDING, PLACEHOLDER } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Ashford & Crane collects, why, and your data rights.",
};

const sections = [
  {
    title: "What we collect and why",
    body: "We collect the information onboarding, compliance, and service delivery genuinely require: identity and contact details, identification documents, tax residency self-certification, source of funds and wealth information, and records of how you use the platform. We practice data minimization — we do not collect what we do not need.",
  },
  {
    title: "Legal basis for processing",
    body: "Processing is grounded in the performance of our services, compliance with legal obligations (including AML/KYC requirements), legitimate interests such as security and fraud prevention, and consent where required. The governing legal framework is confirmed per jurisdiction.",
  },
  {
    title: "Your rights",
    body: "Subject to the framework that applies to you — GDPR for UK/EU clients, CCPA/CPRA for California residents, equivalent local law elsewhere — you may have rights of access, rectification, erasure, and portability. AML/KYC record-retention obligations (commonly five years or longer after a relationship ends, per applicable regulation) can limit the right to erasure; where that applies we will explain it plainly rather than silently decline.",
  },
  {
    title: "Sub-processors",
    body: `The disclosed list of sub-processors — cloud hosting, KYC vendor, screening vendor, and others — is published here once each provider is real and contracted. ${PENDING}.`,
  },
  {
    title: "International data transfers",
    body: "Where data crosses borders, transfer safeguards are applied per the applicable framework. Data-residency options are configurable per partner and jurisdiction rather than fixed to one region.",
  },
  {
    title: "Breach notification",
    body: "Breach-notification timelines follow the regulator-mandated window in each operating jurisdiction once confirmed (72 hours under GDPR is a commonly referenced benchmark; the actual obligation is verified with counsel).",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Privacy Policy</h1>
      <p className="mt-4 text-sm text-charcoal-500 dark:text-platinum-200">
        Version and effective date: {PLACEHOLDER}. Governing language and
        translation versioning are specified in the Terms of Service.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl font-medium">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
