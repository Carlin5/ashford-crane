"use client";

import { useEffect, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { RelativeTime } from "@/components/ui/RelativeTime";

/**
 * FX ticker that re-tweens against the sandbox FxProvider every 8s —
 * simulated live data, never real market data.
 */
export function FxTicker({
  from,
  to,
  initialRate,
}: {
  from: string;
  to: string;
  initialRate: number;
}) {
  const [rate, setRate] = useState(initialRate);
  const [at, setAt] = useState(Date.now());
  const [down, setDown] = useState(false);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/v1/fx/quote?from=${from}&to=${to}&amountMinor=100000`,
        );
        if (res.ok) {
          const data = await res.json();
          setRate(data.quote.fxRate);
          setAt(Date.now());
          setDown(false);
        } else {
          setDown(true);
        }
      } catch {
        setDown(true);
      }
    }, 8000);
    return () => clearInterval(id);
  }, [from, to]);

  return (
    <div>
      {down ? (
        <p className="mt-2 text-sm text-warning-600">
          We couldn&apos;t refresh rates just now — showing the last known
          value.
        </p>
      ) : null}
      <p className="mt-1 text-2xl font-medium">
        <CountUp value={rate} format={(v) => v.toFixed(4)} duration={0.6} />
      </p>
      <RelativeTime at={at} prefix="updated" className="text-xs" />
    </div>
  );
}
