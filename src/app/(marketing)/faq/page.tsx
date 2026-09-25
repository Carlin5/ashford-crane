import type { Metadata } from "next";
import { Faq, type FaqGroup } from "@/components/marketing/Faq";
import { PENDING } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about getting started, fees, security, international transfers, and cards at Ashford & Crane.",
};

const groups: FaqGroup[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "Who can open an account?",
        a: `Individuals and companies in supported jurisdictions, across four tiers: Private, Private Plus, Corporate, and Institutional. ${"Eligibility assessed individually"}; jurisdiction availability is published as it is confirmed.`,
      },
      {
        q: "How does onboarding work?",
        a: "You complete an application covering identity, residence, tax residency, and source of funds; businesses also provide directors, beneficial owners, and corporate documents. A reviewer then completes identity, sanctions, and screening checks — approval is never automatic just because documents were uploaded.",
      },
      {
        q: "Is Ashford & Crane a bank?",
        a: "Ashford & Crane is a financial technology company. Regulated services are provided in partnership with separately regulated institutions; details are published once confirmed. " + PENDING + ".",
      },
    ],
  },
  {
    title: "Fees",
    items: [
      {
        q: "Where can I see the fees?",
        a: "The full fee schedule is published on the Pricing page. More importantly, the exact fee, exchange rate, and recipient amount for any transaction is shown and re-confirmed before you approve it.",
      },
      {
        q: "How is the exchange rate set?",
        a: "Each FX quote applies a disclosed basis-point markup over a named reference rate. The reference-rate source is shown on every quote.",
      },
      {
        q: "Are there hidden charges?",
        a: "No. Where a third party may add a cost — for example a local ATM operator surcharge — we say so explicitly rather than leave it out.",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        q: "How is my account protected?",
        a: "Encryption in transit and at rest, multi-factor authentication, device and session management, transaction-level authentication, and a complete append-only audit trail. The Trust Center explains each control in plain language.",
      },
      {
        q: "Will Ashford & Crane ever ask for my password?",
        a: "Never — not through chat, email, or phone. We also never ask for full card security codes or authentication codes through support channels. Treat any such request as fraudulent.",
      },
      {
        q: "What if I lose my card or see an unfamiliar transaction?",
        a: "Freeze the card instantly from the app, sign out sessions you don't recognize, and contact Technical Support. Support staff see masked details and cannot move your funds.",
      },
    ],
  },
  {
    title: "International Transfers",
    items: [
      {
        q: "How long does a transfer take?",
        a: "Timing depends on the currency corridor and the partner provider delivering the payment. Your transfer shows live status — Draft, Pending verification, Processing, and Completed only once the payment system has actually confirmed completion.",
      },
      {
        q: "Can I schedule a transfer for later?",
        a: "Yes. You can choose a future date at the amount or review step instead of submitting immediately.",
      },
      {
        q: "Can a transfer be reversed?",
        a: "You can cancel a transfer while it is still in draft. Once submitted, contact support promptly — corrections are handled as new, properly recorded entries rather than edits to history.",
      },
    ],
  },
  {
    title: "Cards",
    items: [
      {
        q: "What card products are offered?",
        a: "The Ashford Private Card for personal use and the Ashford Corporate Card for business expenses — both issued through a regulated card issuer once confirmed.",
      },
      {
        q: "Can I use my card at any ATM?",
        a: "ATM availability depends on the card network, issuer, country, and local operator — it is not guaranteed everywhere. The app shows estimated conversion and fees before you withdraw, and local operator surcharges may apply.",
      },
      {
        q: "What controls do I have over my card?",
        a: "Freeze and unfreeze instantly, set spending limits, toggle ATM, online, and contactless use, and restrict where geographically the card can be used.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">
        Frequently Asked Questions
      </h1>
      <div className="mt-12">
        <Faq groups={groups} />
      </div>
    </section>
  );
}
