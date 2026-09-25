import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 ease-[var(--ease-settle)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-champagne-500 text-navy-900 hover:bg-[#b8934f] active:translate-y-px",
  secondary:
    "border border-platinum-200 bg-transparent text-charcoal-900 hover:bg-platinum-100 dark:text-platinum-100 dark:hover:bg-navy-700",
  ghost:
    "text-midnight-600 hover:bg-platinum-100 dark:text-platinum-200 dark:hover:bg-navy-700",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
