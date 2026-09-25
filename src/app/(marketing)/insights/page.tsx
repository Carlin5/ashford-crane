import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Educational articles on cross-border banking, currency management, and account security — general information, not advice.",
};

const articles = [
  {
    slug: "multi-currency-basics",
    title: "Holding Money in More Than One Currency",
    summary:
      "Why internationally active clients keep balances across currencies, and how multi-currency accounts reduce unnecessary conversions.",
    minutes: 5,
  },
  {
    slug: "reading-an-fx-quote",
    title: "How to Read an FX Quote",
    summary:
      "Reference rates, spreads, and recipient amounts — the three numbers that tell you what a transfer really costs.",
    minutes: 4,
  },
  {
    slug: "account-security-habits",
    title: "Everyday Account Security Habits",
    summary:
      "Sessions, devices, and authentication: the routine checks that keep a cross-border account secure.",
    minutes: 4,
  },
] as const;

export default function InsightsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium md:text-5xl">Insights</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Educational pieces on cross-border banking. General information only —
        not financial, legal, or investment advice.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}`}
            className="rounded-[var(--radius-card)] border border-platinum-200 p-6 transition-colors hover:bg-platinum-100/60 dark:border-navy-700 dark:hover:bg-navy-900/40"
          >
            <h2 className="font-display text-xl font-medium">{a.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
              {a.summary}
            </p>
            <p className="mt-4 text-xs text-charcoal-500 dark:text-platinum-200">
              {a.minutes} min read
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
