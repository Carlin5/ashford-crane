import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "champagne";

const tones: Record<Tone, string> = {
  neutral:
    "border-platinum-200 text-charcoal-500 dark:border-navy-700 dark:text-platinum-200",
  success: "border-success-600/40 text-success-600",
  warning: "border-warning-600/40 text-warning-600",
  danger: "border-danger-600/40 text-danger-600",
  info: "border-info-600/40 text-info-600",
  champagne: "border-champagne-500/50 text-champagne-500",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
