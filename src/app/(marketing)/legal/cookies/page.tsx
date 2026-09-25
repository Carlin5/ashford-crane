import type { Metadata } from "next";
import { Table, Td, Th } from "@/components/ui/Table";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies the Ashford & Crane platform uses and why.",
};

const cookies = [
  {
    name: "ac_theme",
    purpose: "Stores your light/dark display preference.",
    duration: "1 year",
    type: "Functional",
  },
  {
    name: "ac_locale",
    purpose: "Stores your language preference (English/Arabic).",
    duration: "1 year",
    type: "Functional",
  },
  {
    name: "ac_session",
    purpose: "Authenticated session (encrypted, httpOnly). Set on sign-in.",
    duration: "Session",
    type: "Strictly necessary",
  },
];

export default function CookiesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Cookie Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        The platform uses a small set of functional and strictly necessary
        cookies. No advertising or cross-site tracking cookies are used.
      </p>
      <div className="mt-8">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Purpose</Th>
              <Th>Duration</Th>
              <Th>Type</Th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((c) => (
              <tr key={c.name}>
                <Td className="font-medium tnum">{c.name}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {c.purpose}
                </Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {c.duration}
                </Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {c.type}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="mt-8 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        You can clear or block cookies through your browser settings; the
        session cookie is required for signed-in functionality.
      </p>
    </section>
  );
}
