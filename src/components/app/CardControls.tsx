"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Card } from "@/server/types";

export function CardControls({ card }: { card: Card }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "freeze" | "unfreeze") {
    setBusy(true);
    await fetch(`/api/v1/cards/${card.id}/${action}`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => act(card.status === "frozen" ? "unfreeze" : "freeze")}
        className="rounded-lg border border-platinum-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-platinum-100 disabled:opacity-50 dark:border-navy-700 dark:hover:bg-navy-700"
      >
        {card.status === "frozen" ? "Unfreeze card" : "Freeze card"}
      </button>
      <div className="flex gap-4 text-sm">
        {(
          [
            ["atm", "ATM withdrawals"],
            ["online", "Online payments"],
            ["contactless", "Contactless"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={card.controls[key]}
              readOnly
              aria-label={label}
              className="accent-[#c9a46b]"
            />
            {label}
          </label>
        ))}
      </div>
      <p className="text-xs text-charcoal-500 dark:text-platinum-200">
        Geographic controls apply per region set on this card.
      </p>
    </div>
  );
}
