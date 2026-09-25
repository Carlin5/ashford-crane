"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function TransactionFilters({
  q,
  from,
  to,
  currency,
  accountCurrency,
}: {
  q: string;
  from: string;
  to: string;
  currency: string;
  accountCurrency: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({ q, from, to, currency });

  function apply() {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) if (v) params.set(k, v);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <Input
        label="Search"
        name="q"
        value={state.q}
        onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
      />
      <Input
        label="From"
        name="from"
        type="date"
        value={state.from}
        onChange={(e) => setState((s) => ({ ...s, from: e.target.value }))}
      />
      <Input
        label="To"
        name="to"
        type="date"
        value={state.to}
        onChange={(e) => setState((s) => ({ ...s, to: e.target.value }))}
      />
      <Select
        label="Currency"
        name="currency"
        value={state.currency}
        onChange={(e) => setState((s) => ({ ...s, currency: e.target.value }))}
      >
        <option value="">All</option>
        <option value={accountCurrency}>{accountCurrency}</option>
      </Select>
      <Button type="submit" variant="secondary">
        Apply
      </Button>
    </form>
  );
}
