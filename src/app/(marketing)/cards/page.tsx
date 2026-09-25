import type { Metadata } from "next";
import { CardTilt } from "@/components/marketing/CardTilt";
import { SectionBlock } from "@/components/marketing/SectionBlock";
import { partnerDisclosure, PENDING } from "@/lib/compliance";

export const metadata: Metadata = {
  title: "Cards",
  description:
    "The Ashford Private Card and Ashford Corporate Card — issued through a regulated card issuer, with controls you manage yourself.",
};

/** CSS-drawn product shot — no network logos, ever. */
function CardFace({
  name,
  variant,
}: {
  name: string;
  variant: "private" | "corporate";
}) {
  return (
    <div
      className={`flex aspect-[8/5] w-full max-w-sm flex-col justify-between rounded-xl p-6 ${
        variant === "private"
          ? "bg-gradient-to-br from-navy-900 via-navy-700 to-midnight-600 text-white"
          : "bg-gradient-to-br from-charcoal-900 via-charcoal-500 to-navy-700 text-platinum-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-sm font-medium">
          Ashford &amp; Crane
        </span>
        <span className="h-8 w-11 rounded-md border border-champagne-500/60 bg-champagne-500/20" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-platinum-200/70">
          {name}
        </p>
        <p className="mt-1 text-sm text-platinum-200/70 tnum">
          •••• •••• •••• ••••
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-platinum-200/60">
          Issued by a regulated card issuer — {PENDING}
        </p>
      </div>
    </div>
  );
}

const privateFeatures = [
  "Premium debit card linked to your multi-currency accounts",
  "International usage and ATM withdrawals where supported",
  "Contactless and online payments",
  "Apple Pay / Google Pay where the issuer supports it",
  "Freeze and unfreeze instantly; set your own limits",
];

const corporateFeatures = [
  "Business expense cards for employees",
  "Per-card spending limits and merchant controls",
  "Real-time transaction notifications",
  "ATM, online, and contactless toggles per card",
  "Geographic controls for where each card can be used",
];

export default function CardsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl font-medium md:text-5xl">Cards</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
          Two card products, both issued through a regulated card issuer once
          confirmed — never through a fabricated network membership. Controls
          live in your hands: freeze, limits, and where each card can be used.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 lg:grid-cols-2">
        <div>
          <CardTilt>
            <CardFace name="Ashford Private Card" variant="private" />
          </CardTilt>
          <h2 className="mt-6 font-display text-2xl font-medium">
            Ashford Private Card
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-charcoal-500 dark:text-platinum-200">
            {privateFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <CardTilt>
            <CardFace name="Ashford Corporate Card" variant="corporate" />
          </CardTilt>
          <h2 className="mt-6 font-display text-2xl font-medium">
            Ashford Corporate Card
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-charcoal-500 dark:text-platinum-200">
            {corporateFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <SectionBlock title="Issuer attribution" className="pt-0">
        <p>{partnerDisclosure({ service: "Card issuing" })}</p>
        <p>
          ATM availability depends on the card network, issuer, country, and
          local ATM operator; local operator surcharges may apply. Raw card
          numbers never touch Ashford &amp; Crane&apos;s own servers — card
          data is tokenized through the issuer.
        </p>
      </SectionBlock>
    </>
  );
}
