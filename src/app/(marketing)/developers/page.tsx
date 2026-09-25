import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { Table, Td, Th } from "@/components/ui/Table";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Institutional API access — versioned REST endpoints under /v1, sandbox keys, and OpenAPI documentation.",
};

/** Parses the repo's openapi.yaml into a simple endpoint list. */
async function endpoints(): Promise<{ method: string; path: string; summary: string }[]> {
  const yaml = await readFile(path.join(process.cwd(), "openapi.yaml"), "utf8");
  const out: { method: string; path: string; summary: string }[] = [];
  let currentPath = "";
  for (const line of yaml.split("\n")) {
    const p = line.match(/^  (\/[^:]+):/);
    if (p) currentPath = p[1];
    const m = line.match(/^    (get|post|put|delete|patch):/);
    if (m && currentPath) {
      const method = m[1].toUpperCase();
      out.push({ method, path: currentPath, summary: "" });
    }
    const s = line.match(/^      summary: (.+)$/);
    if (s && out.length) out[out.length - 1].summary = s[1];
  }
  return out;
}

export default async function DevelopersPage() {
  const list = await endpoints();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">
        Developers
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Institutional-tier API access to the platform: versioned REST under{" "}
        <code className="text-sm">/api/v1</code>, session or sandbox-key
        authentication (<code className="text-sm">X-Sandbox-Key</code>),
        idempotency keys on every financial write, and rate limiting. The
        endpoint list below is generated from this repository&apos;s{" "}
        <code className="text-sm">openapi.yaml</code>.
      </p>
      <div className="mt-10">
        <Table>
          <thead>
            <tr>
              <Th>Method</Th>
              <Th>Path</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={`${e.method} ${e.path}`}>
                <Td className="font-medium tnum">{e.method}</Td>
                <Td className="tnum">/v1{e.path}</Td>
                <Td className="text-charcoal-500 dark:text-platinum-200">
                  {e.summary}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Sandbox keys are valid only against this demo environment and never
        against production. API access is enabled per Institutional account
        after onboarding.
      </p>
    </section>
  );
}
