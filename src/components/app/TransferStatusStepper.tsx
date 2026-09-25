import { statusLabel } from "@/lib/labels";
import { Stepper } from "@/components/ui/Stepper";
import type { TransferStatus } from "@/server/types";

const FLOW = [
  { id: "Draft", label: "Draft" },
  { id: "PendingVerification", label: "Pending verification" },
  { id: "Processing", label: "Processing" },
  { id: "Completed", label: "Completed" },
];

/**
 * Forward-only status stepper. Failed/Rejected/Cancelled render as a
 * terminal note rather than moving the stepper backwards.
 */
export function TransferStatusStepper({
  status,
  compact = false,
}: {
  status: TransferStatus;
  compact?: boolean;
}) {
  const idx = FLOW.findIndex((s) => s.id === status);
  const terminal = ["Failed", "Rejected", "Cancelled"].includes(status);
  return (
    <div className={compact ? "opacity-90" : ""}>
      <Stepper steps={FLOW} currentIndex={idx >= 0 ? idx : FLOW.length} />
      {terminal ? (
        <p className="mt-2 text-sm font-medium text-danger-600">{statusLabel(status)}</p>
      ) : null}
    </div>
  );
}
