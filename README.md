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

## Demo logins (seeded, Phase B)

Password for all demo users: `demo-sandbox`. Sandbox MFA code: `000000`.

- `client.private@demo.ashfordcrane.test` — Private tier ("Amara Okello")
- `client.corporate@demo.ashfordcrane.test` — Corporate ("Halcyon Trading Ltd")
- `admin@`, `compliance@`, `ops@`, `ops2@`, `support@`, `rm@`, `finance@`,
  `risk@` — staff roles at `demo.ashfordcrane.test`

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
