"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SupportForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/v1/support/tickets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        subject: form.get("subject"),
        message: form.get("message"),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the ticket — try again.");
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <Input label="Subject" name="subject" required />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="rounded-lg border border-platinum-200 bg-white px-3.5 py-2.5 text-sm dark:border-navy-700 dark:bg-charcoal-900"
        />
      </div>
      {error ? <p role="alert" className="text-sm text-danger-600">{error}</p> : null}
      <Button type="submit" disabled={busy}>Open ticket</Button>
    </form>
  );
}
