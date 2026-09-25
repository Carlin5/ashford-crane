"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function MfaForm({ next, role }: { next?: string; role: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/v1/auth/mfa", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: form.get("code") }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error?.message ?? "Verification failed. Try again.");
      return;
    }
    const dest =
      role === "client" ? (next ?? "/app") : role === "relationship_manager" ? "/rm" : "/admin";
    router.push(dest);
    router.refresh();
  }

  return (
    <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
      <Input
        label="Authentication code"
        name="code"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        autoComplete="one-time-code"
        required
      />
      {error ? (
        <p role="alert" className="text-sm text-danger-600">{error}</p>
      ) : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Verifying…" : "Verify"}
      </Button>
    </form>
  );
}
