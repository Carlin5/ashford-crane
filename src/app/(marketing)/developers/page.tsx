import type { Metadata } from "next";
import { Table, Td, Th } from "@/components/ui/Table";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Institutional API access — versioned REST endpoints under /v1, sandbox keys, and OpenAPI documentation.",
};

const endpoints = [
  ["POST", "/v1/auth/login", "Authenticate; returns an MFA challenge."],
  ["POST", "/v1/auth/mfa", "Complete multi-factor authentication."],
  ["POST", "/v1/auth/logout", "End the session."],
  ["GET", "/v1/customers/me", "Current customer profile."],
  ["GET", "/v1/accounts", "List accounts and balances."],
  ["GET", "/v1/accounts/:id", "Single account detail."],
  ["GET", "/v1/transactions", "Transactions, filterable by date and currency."],
  ["POST", "/v1/transfers", "Create a transfer (Idempotency-Key required)."],
  ["GET", "/v1/transfers/:id", "Transfer status."],
  ["POST", "/v1/transfers/:id/approve", "Second-authorizer approval (dual control)."],
  ["GET", "/v1/beneficiaries", "List beneficiaries."],
  ["POST", "/v1/beneficiaries", "Create a beneficiary."],
  ["GET", "/v1/cards", "List cards."],
  ["POST", "/v1/cards/:id/freeze", "Freeze a card."],
  ["POST", "/v1/cards/:id/unfreeze", "Unfreeze a card."],
  ["GET", "/v1/statements", "Monthly statements."],
  ["POST", "/v1/kyc/documents", "Upload onboarding documents."],
  ["GET", "/v1/notifications", "Notifications for the current user."],
  ["POST", "/v1/support/tickets", "Open a support ticket."],
  ["GET", "/v1/fx/quote", "FX quote with named reference-rate source."],
] as const;

export default function DevelopersPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">
        Developers
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Institutional-tier API access to the platform: versioned REST under{" "}
        <code className="text-sm">/api/v1</code>, session or sandbox-key
        authentication, idempotency keys on every financial write, and rate
        limiting. Sandbox keys (<code className="text-sm">X-Sandbox-Key</code>)
        are valid only against the demo environment and never against
        production.
      </p>
      <div className="mt-10">
        <Table>
          <thead>
            <tr>
              <Th>Method</Th>
              <Th>Path</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(([m, p, d]) => (
              <tr key={`${m} ${p}`}>
                <Td className="font-medium tnum">{m}</Td>
                <Td className="tnum">{p}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {d}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Full OpenAPI documentation is published for Institutional clients; API
        access is enabled per account after onboarding.
      </p>
    </section>
  );
}
