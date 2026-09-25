import { DEMO_BANNER_TEXT } from "@/lib/compliance";

/** Persistent warning-colored top strip on every page in non-production. */
export function DemoBanner() {
  return (
    <div
      role="note"
      className="bg-warning-600 px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-white"
    >
      {DEMO_BANNER_TEXT}
    </div>
  );
}
