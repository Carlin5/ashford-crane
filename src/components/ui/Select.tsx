import { forwardRef, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, id, className = "", children, ...props },
  ref,
) {
  const selectId = id ?? props.name;
  const descId = error ? `${selectId}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={descId}
        className={`rounded-lg border border-platinum-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 focus:border-midnight-600 dark:border-navy-700 dark:bg-charcoal-900 dark:text-platinum-100 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={descId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});
