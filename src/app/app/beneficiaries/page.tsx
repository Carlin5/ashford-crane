import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getStore, delay } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { BeneficiaryForm } from "./BeneficiaryForm";

export const metadata: Metadata = { title: "Beneficiaries" };

export default async function BeneficiariesPage() {
  const session = await getSession();
  const store = getStore();
  ensureSeed(store);
  await delay(400);
  const list = [...store.beneficiaries.values()].filter(
    (b) => b.customerId === session.customerId,
  );
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Beneficiaries</h1>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Account</Th>
              <Th>Currency</Th>
              <Th>Bank</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id}>
                <Td className="font-medium">{b.name}</Td>
                <Td className="tnum">{b.accountIdentifier}</Td>
                <Td>{b.currency}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">{b.bankName}</Td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr>
                <Td colSpan={4} className="py-8 text-center text-charcoal-500 dark:text-platinum-200">
                  No beneficiaries yet — add the people and companies you pay.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
      <Card className="p-6">
        <h2 className="font-medium">Add a beneficiary</h2>
        <BeneficiaryForm />
      </Card>
    </div>
  );
}
