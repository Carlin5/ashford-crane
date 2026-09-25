import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const descId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={descId}
        className={`rounded-lg border border-platinum-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-500 focus:border-midnight-600 dark:border-navy-700 dark:bg-charcoal-900 dark:text-platinum-100 ${className}`}
        {...props}
      />
      {error ? (
        <p id={descId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      ) : hint ? (
        <p id={descId} className="text-sm text-charcoal-500 dark:text-platinum-200">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
