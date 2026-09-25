import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AML/KYC Information",
  description:
    "How identity verification, screening, and transaction monitoring work at Ashford & Crane.",
};

const sections = [
  {
    title: "What we verify",
    body: "Individuals provide legal name, date of birth, nationality, residential address, tax residence, identification document, proof of address, and source of funds and wealth. Businesses additionally provide registration details, directors, beneficial owners, business activity, and expected volumes.",
  },
  {
    title: "Screening",
    body: "Every application is screened against sanctions, politically-exposed-person, and adverse-media data, both at onboarding and on an ongoing basis, using a named screening vendor once integrated. Transactions are screened as they occur.",
  },
  {
    title: "Monitoring",
    body: "Account activity is monitored for unusual velocity, geographic risk, and amounts inconsistent with the profile on file. Alerts are reviewed by compliance staff, never automatically cleared.",
  },
  {
    title: "Application outcomes",
    body: "Applications move through Application started, Documents required, Under review, Additional information required, Approved, Declined, or Restricted. Uploading documents never approves an application by itself — a completed human review is always required.",
  },
  {
    title: "Your obligations",
    body: "Provide accurate information, keep documents current, and respond to information requests. Know that providing false information in a financial application may itself be an offence in your jurisdiction.",
  },
];

export default function AmlKycPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">
        AML/KYC Information
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Identity verification and anti-money-laundering controls exist to keep
        the platform — and the regulated partners behind it — clean. Here is
        what that means for you in practice.
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
