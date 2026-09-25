import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Payments</h1>
      <Card className="p-10 text-center">
        <h2 className="font-display text-xl font-medium">
          Payments move through Transfers
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-500 dark:text-platinum-200">
          Every outgoing payment — domestic or international — is made as a
          transfer so the fee, rate, and recipient amount are always confirmed
          before anything moves.
        </p>
        <ButtonLink href="/app/transfers/new" className="mt-6">
          Make a payment
        </ButtonLink>
      </Card>
    </div>
  );
}
