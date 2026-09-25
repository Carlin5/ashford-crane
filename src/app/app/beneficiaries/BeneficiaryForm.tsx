"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const CURRENCIES = ["USD", "EUR", "GBP", "UGX", "KES", "AED"];

export function BeneficiaryForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/v1/beneficiaries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        accountIdentifier: form.get("accountIdentifier"),
        currency: form.get("currency"),
        bankName: form.get("bankName"),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the beneficiary — check the details.");
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
      <Input label="Name" name="name" required />
      <Input label="Account identifier" name="accountIdentifier" required />
      <Select label="Currency" name="currency" required>
        {CURRENCIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Select>
      <Input label="Bank name" name="bankName" required />
      {error ? <p role="alert" className="text-sm text-danger-600">{error}</p> : null}
      <div>
        <Button type="submit" disabled={busy}>Add beneficiary</Button>
      </div>
    </form>
  );
}
