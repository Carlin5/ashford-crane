# Ashford & Crane Private Bank — Platform

An international private-banking and wealth-management **technology
platform** for clients operating across borders. This repository contains
the marketing site and (in later phases) the client app, admin portal, RM
portal, and API.

> **Sandbox / demo only.** Everything here runs against fictional demo data.
> A persistent "DEMO ENVIRONMENT — NO REAL FUNDS." banner is shown on every
> page when `NEXT_PUBLIC_ENV` is not `production`. No real funds, licenses,
> partners, or credentials are asserted anywhere — missing regulatory facts
> render as "Information pending regulatory confirmation" via
> `src/lib/compliance.ts`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 (design tokens in `src/app/globals.css` `@theme`)
- framer-motion (2D motion), React Three Fiber + drei (marketing hero only,
  dynamically imported with `ssr: false`, reduced-motion → static fallback)
- lucide-react icons, recharts, zod, iron-session, vitest
- pnpm

## Scripts

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Dev server                       |
| `pnpm build`      | Production build                 |
| `pnpm lint`       | ESLint (next config)             |
| `pnpm typecheck`  | `tsc --noEmit`                   |
| `pnpm test`       | vitest                           |

## Environment

Deployable with **zero env vars**. Optional:

- `NEXT_PUBLIC_ENV` — set to `production` to hide the demo banner (default: demo).
- `SESSION_SECRET` — iron-session cookie secret; falls back to a dev default
  with a console warning when unset (auth lands in Phase B).
- `CONTACT_EMAIL_*` — contact-channel addresses (`GENERAL`, `PRIVATE`,
  `CORPORATE`, `COMPLIANCE`, `SUPPORT`, `PARTNERSHIPS`); unset channels show a
  pending placeholder.

## Demo logins

Password for all demo users: `demo-sandbox`. Sandbox MFA code: `000000`.
All addresses end in `@demo.ashfordcrane.test`.

| Email prefix        | Role                  | Lands on | Notes                                      |
| ------------------- | --------------------- | -------- | ------------------------------------------ |
| `client.private`    | Client (Amara Okello) | `/app`   | Private Plus, multi-currency accounts      |
| `client.corporate`  | Client (Halcyon)      | `/app`   | Corporate tier, dual-control approvals     |
| `client.corporate2` | Client (Halcyon)      | `/app`   | Second corporate user                      |
| `admin`             | Super admin           | `/admin` | Full portal incl. Users & Roles            |
| `compliance`        | Compliance officer    | `/admin` | KYC review, cases, alerts                  |
| `ops` / `ops2`      | Operations officer    | `/admin` | Transfer dual control needs both           |
| `support`           | Customer support      | `/admin` | Masked PII, card freeze only               |
| `rm`                | Relationship manager  | `/rm`    | Assigned clients only, no fund movement    |
| `finance`           | Finance officer       | `/admin` | Transfer approvals, fees view              |
| `risk`              | Risk officer          | `/admin` | Review-only KYC, case escalation           |

## Sandbox vs production

This build is the **sandbox**: all data lives in a deterministic in-memory
store (`src/server/store`), provider integrations are simulated adapters
(`src/server/domain/providers/sandbox.ts`) with health toggles, document
uploads are metadata-only, and MFA accepts a fixed code. A transfer only
reaches `Completed` when the sandbox `BankingProvider` reports completion
(~10s after submission, advanced lazily on read).

Nothing here is wired to real rails: no real funds move, no real KYC vendor
is called, and no external network requests are made at runtime. In
production the same domain boundaries would bind to real providers, a real
session secret (`SESSION_SECRET`) must be set, and `NEXT_PUBLIC_ENV=production`
hides the demo banner. `prisma/schema.prisma` documents the intended
production schema only — the sandbox does not use a database.

## Deployment

Deploys cleanly on **Vercel** with zero configuration: push the repo,
import it, and the Next.js defaults apply (`pnpm install`, `next build`).
No env vars are required for the sandbox; set `SESSION_SECRET` (and
`NEXT_PUBLIC_ENV`) in the Vercel project settings if needed. The in-memory
store reseeds per server instance — serverless cold starts get fresh demo
data, which is expected.

## Compliance guardrails (enforced in code)

- `src/lib/compliance.ts` — `PENDING` wording, Section 20.1 positioning
  statement, Section 28 partner disclosure template, `DEMO_BANNER_TEXT`.
- No card-network logos, SWIFT/BIC claims, deposit insurance, testimonials,
  awards, partner logos, founders, or addresses anywhere in the UI.
- All monetary amounts are integer minor units (`src/lib/money.ts`); UGX is
  zero-decimal.
- Fees and jurisdiction availability come from `config/` — never hardcoded
  in UI.

## Layout

- `src/app/(marketing)` — public site with shared header/footer
- `src/app/login`, `/onboarding` — auth entry points (Phase B wires backend)
- `src/components/{ui,marketing,motion}` — design system
- `config/` — fees, tiers, jurisdictions, contacts
- `tests/` — vitest unit tests
