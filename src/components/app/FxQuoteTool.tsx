"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatMoney } from "@/lib/money";

export function FxQuoteTool({ currencies }: { currencies: string[] }) {
  const [from, setFrom] = useState(currencies[0]);
  const [to, setTo] = useState(currencies[1] ?? currencies[0]);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<{
    feeMinor: number; fxRate: number;
    referenceRateSource: string; recipientAmountMinor: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getQuote() {
    setError(null);
    const dp = from === "UGX" ? 0 : 2;
    const amountMinor = Math.round(Number(amount) * 10 ** dp);
    const res = await fetch(
      `/api/v1/fx/quote?from=${from}&to=${to}&amountMinor=${amountMinor}`,
    );
    if (!res.ok) {
      setQuote(null);
      setError("We couldn't fetch a quote just now — try again shortly.");
      return;
    }
    const d = await res.json();
    setQuote(d.quote);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="From" value={from} onChange={(e) => setFrom(e.target.value)}>
          {currencies.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select label="To" value={to} onChange={(e) => setTo(e.target.value)}>
          {currencies.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Input
          label={`Amount (${from})`}
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button onClick={getQuote} variant="secondary">Get quote</Button>
      {error ? <p role="alert" className="text-sm text-warning-600">{error}</p> : null}
      {quote ? (
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Rate</dt><dd className="font-medium tnum">1 {from} = {quote.fxRate.toFixed(4)} {to}</dd></div>
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Fee</dt><dd className="font-medium">{formatMoney(quote.feeMinor, from as never)}</dd></div>
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Recipient gets</dt><dd className="font-medium">{formatMoney(quote.recipientAmountMinor, to as never)}</dd></div>
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Reference source</dt><dd className="font-medium">{quote.referenceRateSource}</dd></div>
        </dl>
      ) : null}
    </div>
  );
}
