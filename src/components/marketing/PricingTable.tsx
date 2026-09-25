import { FEE_SCHEDULE, REFERENCE_RATE_SOURCE } from "@/../config/fees";
import { Table, Td, Th } from "@/components/ui/Table";

/** Section 15 fee table, rendered entirely from config/fees.ts. */
export function PricingTable() {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Category</Th>
          <Th>Model</Th>
          <Th>Note</Th>
        </tr>
      </thead>
      <tbody>
        {FEE_SCHEDULE.map((row) => (
          <tr key={row.category}>
            <Td className="font-medium text-charcoal-900 dark:text-platinum-100">
              {row.category}
            </Td>
            <Td className="text-charcoal-500 dark:text-platinum-200">
              {row.model}
            </Td>
            <Td className="text-charcoal-500 dark:text-platinum-200">
              {row.category === "FX spread"
                ? `Reference-rate source: ${REFERENCE_RATE_SOURCE}`
                : (row.note ?? "—")}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
