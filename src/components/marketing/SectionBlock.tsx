import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Marketing section block. `tinted` paints a full-width platinum band; inner
 * content always shares the same max-w-6xl container as every other section.
 */
export function SectionBlock({
  title,
  children,
  href,
  linkLabel,
  tinted = false,
  className = "",
}: {
  title: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`${tinted ? "bg-platinum-100/60 dark:bg-navy-900/30" : ""}`}
    >
      <div className={`mx-auto max-w-6xl px-6 py-16 md:py-24 ${className}`}>
        <h2 className="font-display text-3xl font-medium md:text-4xl">
          {title}
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-charcoal-500 dark:text-platinum-200">
          {children}
        </div>
        {href && linkLabel ? (
          <Link
            href={href}
            className="mt-6 inline-block text-sm font-medium text-midnight-600 underline decoration-platinum-200 underline-offset-4 hover:decoration-champagne-500 dark:text-champagne-500"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
