import type { Metadata } from "next";
import { JURISDICTIONS } from "@/../config/jurisdictions";
import { Table, Td, Th } from "@/components/ui/Table";

export const metadata: Metadata = {
  title: "Jurisdiction Availability",
  description:
    "Where Ashford & Crane services are available — updated only as real availability is confirmed.",
};

export default function JurisdictionsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">
        Jurisdiction Availability
      </h1>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Availability is populated only as it is genuinely confirmed — this
        table never implies licensing that does not yet exist. Onboarding
        checks your country early so applicants we cannot yet serve are told
        clearly rather than completing an application that would be declined.
      </p>
      <div className="mt-8">
        <Table>
          <thead>
            <tr>
              <Th>Country / Region</Th>
              <Th>Services available</Th>
              <Th>Onboarding status</Th>
              <Th>Regulatory notes</Th>
            </tr>
          </thead>
          <tbody>
            {JURISDICTIONS.map((j) => (
              <tr key={j.country}>
                <Td className="font-medium">{j.country}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {j.servicesAvailable}
                </Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {j.onboardingStatus}
                </Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {j.regulatoryNotes}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
