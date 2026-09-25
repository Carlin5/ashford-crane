import { Check } from "lucide-react";

type Step = { id: string; label: string };

/**
 * Horizontal status stepper. The connecting line animates forward only;
 * statuses never silently skip backward (caller supplies forward-only order).
 */
export function Stepper({
  steps,
  currentIndex,
}: {
  steps: Step[];
  currentIndex: number;
}) {
  return (
    <ol className="flex items-center" aria-label="Progress">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={current ? "step" : undefined}
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-200 ease-[var(--ease-settle)] ${
                  done
                    ? "border-success-600 bg-success-600 text-white"
                    : current
                      ? "border-champagne-500 text-champagne-500"
                      : "border-platinum-200 text-charcoal-500 dark:border-navy-700 dark:text-platinum-200"
                }`}
              >
                {done ? <Check size={14} aria-hidden /> : i + 1}
              </span>
              <span
                className={`text-xs ${current ? "font-medium" : "text-charcoal-500 dark:text-platinum-200"}`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div
                aria-hidden
                className={`mx-2 mb-5 h-px flex-1 transition-colors duration-300 ${
                  done ? "bg-success-600" : "bg-platinum-200 dark:bg-navy-700"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
