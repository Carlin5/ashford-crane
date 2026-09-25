"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/ui/Money";
import type { Currency } from "@/lib/money";
import { formatMoney } from "@/lib/money";

type Account = {
  id: string; name: string; currency: Currency;
  identifier: string; balanceMinor: number;
};
type Beneficiary = { id: string; name: string; currency: Currency; bankName: string };
type Quote = {
  feeMinor: number; fxRate: number;
  referenceRateSource: string; recipientAmountMinor: number;
};

/**
 * Ten-step transfer flow (spec Section 11): source → beneficiary → currency
 * → amount (+schedule) → rate → fees → recipient → review → authenticate →
 * submit. Corporate tiers show an additional Approval state after submit.
 */
const STEPS = [
  { id: "source", label: "Source" },
  { id: "beneficiary", label: "Beneficiary" },
  { id: "currency", label: "Currency" },
  { id: "amount", label: "Amount" },
  { id: "rate", label: "Rate" },
  { id: "fees", label: "Fees" },
  { id: "recipient", label: "Recipient" },
  { id: "review", label: "Review" },
  { id: "auth", label: "Authenticate" },
  { id: "submit", label: "Submit" },
];

export function TransferWizard({
  accounts,
  beneficiaries,
  corporate,
}: {
  accounts: Account[];
  beneficiaries: Beneficiary[];
  corporate: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sourceId, setSourceId] = useState(accounts[0]?.id ?? "");
  const [benId, setBenId] = useState(beneficiaries[0]?.id ?? "");
  const [amountMajor, setAmountMajor] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string; id: string } | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const source = accounts.find((a) => a.id === sourceId);
  const ben = beneficiaries.find((b) => b.id === benId);
  const toCurrency: Currency = ben?.currency ?? "USD";

  const amountMinor = useMemo(() => {
    const n = Number(amountMajor);
    if (!Number.isFinite(n) || n <= 0) return 0;
    const dp = source?.currency === "UGX" ? 0 : 2;
    return Math.round(n * 10 ** dp);
  }, [amountMajor, source]);

  // Fetch the quote when we reach the rate step.
  useEffect(() => {
    if (step !== 4 || !source || amountMinor <= 0) return;
    let cancelled = false;
    fetch(
      `/api/v1/fx/quote?from=${source.currency}&to=${toCurrency}&amountMinor=${amountMinor}`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (!cancelled) setQuote(d.quote); })
      .catch(() => { if (!cancelled) setError("We couldn't fetch a quote just now — try again."); });
    return () => { cancelled = true; };
  }, [step, source, toCurrency, amountMinor]);

  function canContinue(): boolean {
    switch (step) {
      case 0: return Boolean(sourceId);
      case 1: return Boolean(benId);
      case 2: return true;
      case 3: return amountMinor > 0 && (!!source && amountMinor <= source.balanceMinor);
      case 4: case 5: case 6: return Boolean(quote);
      case 7: return true;
      case 8: return mfaCode.length === 6;
      default: return true;
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/v1/transfers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": idempotencyKey,
      },
      body: JSON.stringify({
        sourceAccountId: sourceId,
        beneficiaryId: benId,
        currency: source!.currency,
        amountMinor,
        feeMinor: quote!.feeMinor,
        recipientAmountMinor: quote!.recipientAmountMinor,
        recipientCurrency: toCurrency,
        fxRate: quote!.fxRate,
        scheduledFor: scheduled ? Date.parse(scheduled) : undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError(d?.error?.message ?? "The transfer could not be submitted.");
      return;
    }
    const d = await res.json();
    setSubmitted({ reference: d.transfer.reference, id: d.transfer.id });
  }

  if (submitted) {
    return (
      <Card elevated className="p-8">
        <h2 className="font-display text-2xl font-medium">
          Transfer submitted
        </h2>
        <p className="mt-4 text-sm text-charcoal-500 dark:text-platinum-200">
          Reference{" "}
          <span className="tnum font-medium">{submitted.reference}</span>
          {corporate
            ? ". As a corporate transfer it now needs two staff authorizations (1 of 2 shown until complete)."
            : ". It is processing now; we mark it Completed only once the payment system confirms completion."}
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push(`/app/transfers/${submitted.id}`)}
        >
          Track this transfer
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <Stepper
        steps={corporate ? [...STEPS.slice(0, 9), { id: "approval", label: "Approval" }, STEPS[9]] : STEPS}
        currentIndex={step}
      />
      <div className="mt-10 max-w-xl space-y-5">
        {step === 0 && (
          <Select label="Source account" value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {formatMoney(a.balanceMinor, a.currency)}
              </option>
            ))}
          </Select>
        )}
        {step === 1 && (
          <Select label="Beneficiary" value={benId} onChange={(e) => setBenId(e.target.value)}>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.bankName} ({b.currency})
              </option>
            ))}
          </Select>
        )}
        {step === 2 && (
          <div>
            <p className="text-sm font-medium">Send currency</p>
            <p className="mt-2 text-sm text-charcoal-500 dark:text-platinum-200">
              Sending in {source?.currency} from {source?.name}; the recipient
              receives {toCurrency}.
            </p>
          </div>
        )}
        {step === 3 && (
          <>
            <Input
              label={`Amount (${source?.currency})`}
              inputMode="decimal"
              value={amountMajor}
              onChange={(e) => setAmountMajor(e.target.value)}
              error={
                source && amountMinor > source.balanceMinor
                  ? "Amount exceeds available balance."
                  : undefined
              }
            />
            <Input
              label="Schedule for later (optional)"
              type="date"
              value={scheduled}
              onChange={(e) => setScheduled(e.target.value)}
            />
          </>
        )}
        {step === 4 && (
          <div>
            <p className="text-sm font-medium">Exchange rate</p>
            {quote ? (
              <p className="mt-2 text-2xl font-medium tnum">
                1 {source?.currency} = {quote.fxRate.toFixed(4)} {toCurrency}
              </p>
            ) : (
              <p className="mt-2 text-sm text-charcoal-500">Fetching quote…</p>
            )}
            <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
              Reference rate source: {quote?.referenceRateSource ?? "—"}
            </p>
          </div>
        )}
        {step === 5 && quote && (
          <div>
            <p className="text-sm font-medium">Fees</p>
            <p className="mt-2 text-2xl font-medium">
              <Money amountMinor={quote.feeMinor} currency={source?.currency ?? "USD"} />
            </p>
            <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
              Flat fee plus corridor percentage, per the published schedule.
            </p>
          </div>
        )}
        {step === 6 && quote && (
          <div>
            <p className="text-sm font-medium">Recipient receives</p>
            <p className="mt-2 text-2xl font-medium">
              <Money amountMinor={quote.recipientAmountMinor} currency={toCurrency} />
            </p>
            <p className="mt-2 text-xs text-charcoal-500 dark:text-platinum-200">
              After the fee and rate shown — nothing else is deducted.
            </p>
          </div>
        )}
        {step === 7 && quote && source && ben && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-charcoal-500 dark:text-platinum-200">From</dt><dd className="font-medium">{source.name}</dd></div>
            <div><dt className="text-charcoal-500 dark:text-platinum-200">To</dt><dd className="font-medium">{ben.name}</dd></div>
            <div><dt className="text-charcoal-500 dark:text-platinum-200">You send</dt><dd className="font-medium"><Money amountMinor={amountMinor} currency={source.currency} /></dd></div>
            <div><dt className="text-charcoal-500 dark:text-platinum-200">Fee</dt><dd className="font-medium"><Money amountMinor={quote.feeMinor} currency={source.currency} /></dd></div>
            <div><dt className="text-charcoal-500 dark:text-platinum-200">Rate</dt><dd className="font-medium tnum">{quote.fxRate.toFixed(4)}</dd></div>
            <div><dt className="text-charcoal-500 dark:text-platinum-200">Recipient gets</dt><dd className="font-medium"><Money amountMinor={quote.recipientAmountMinor} currency={toCurrency} /></dd></div>
            {scheduled ? (
              <div><dt className="text-charcoal-500 dark:text-platinum-200">Scheduled</dt><dd className="font-medium">{scheduled}</dd></div>
            ) : null}
          </dl>
        )}
        {step === 8 && (
          <div>
            <Input
              label="Authentication code"
              inputMode="numeric"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              hint="Moving money always requires authentication. Sandbox code: 000000."
            />
          </div>
        )}
        {step === 9 && (
          <p className="text-sm text-charcoal-500 dark:text-platinum-200">
            Confirm to submit. The reference is generated by the server.
            {corporate
              ? " Two staff authorizations are then required before this transfer proceeds."
              : ""}
          </p>
        )}
        {error ? (
          <p role="alert" className="text-sm text-danger-600">{error}</p>
        ) : null}
      </div>
      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canContinue()} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button disabled={busy || !canContinue()} onClick={submit}>
            {busy ? "Submitting…" : "Submit transfer"}
          </Button>
        )}
      </div>
    </Card>
  );
}
