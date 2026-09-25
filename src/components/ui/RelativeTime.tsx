"use client";

import { useEffect, useState } from "react";

function describe(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Live relative timestamp ("updated 12s ago") that keeps itself current. */
export function RelativeTime({
  at,
  prefix,
  className = "",
}: {
  at: Date | number;
  prefix?: string;
  className?: string;
}) {
  const ts = typeof at === "number" ? at : at.getTime();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      dateTime={new Date(ts).toISOString()}
      className={`text-sm text-charcoal-500 dark:text-platinum-200 ${className}`}
    >
      {prefix ? `${prefix} ` : ""}
      {describe(Date.now() - ts)}
    </time>
  );
}
