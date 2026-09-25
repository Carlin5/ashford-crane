import type {
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ReactNode,
} from "react";

/** Row dividers only, no vertical rules; numeric columns right-aligned. */
export function Table({
  children,
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({
  numeric = false,
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      className={`border-b border-platinum-200 py-3 pr-4 text-start text-xs font-medium text-charcoal-500 dark:border-navy-700 dark:text-platinum-200 ${
        numeric ? "text-end tnum" : ""
      } ${className}`}
      {...props}
    />
  );
}

export function Td({
  numeric = false,
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={`border-b border-platinum-200/60 py-3 pr-4 dark:border-navy-700/60 ${
        numeric ? "text-end tnum" : ""
      } ${className}`}
      {...props}
    />
  );
}
