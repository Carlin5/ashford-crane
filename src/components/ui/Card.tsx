import type { HTMLAttributes, ReactNode } from "react";

/** Single 1px platinum border, 10px radius; shadow only when elevated. */
export function Card({
  children,
  elevated = false,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-platinum-200 bg-white dark:border-navy-700 dark:bg-charcoal-900 ${
        elevated ? "shadow-card" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
