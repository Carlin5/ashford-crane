import type { Metadata } from "next";
import { notFound } from "next/navigation";

const articles: Record<
  string,
  { title: string; minutes: number; body: string[] }
> = {
  "multi-currency-basics": {
    title: "Holding Money in More Than One Currency",
    minutes: 5,
    body: [
      "If you earn in one currency and spend in another, every transaction quietly includes a conversion — and every conversion has a cost. A multi-currency account lets you hold balances in the currencies you actually use, converting when you choose rather than whenever a payment forces the issue.",
      "The practical effect is planning, not speculation. A business earning in EUR and paying suppliers in USD can hold both and convert when the timing suits its cash flow, instead of converting automatically at a rate and moment it did not select.",
      "A few things worth checking in any multi-currency arrangement: which currencies are supported, how figures are displayed (a Ugandan shilling balance has no decimal places, and your account should respect that), and what each conversion actually costs — which is the subject of our piece on reading an FX quote.",
    ],
  },
  "reading-an-fx-quote": {
    title: "How to Read an FX Quote",
    minutes: 4,
    body: [
      "Every currency conversion quote reduces to three numbers: the reference rate, the spread, and the recipient amount. The reference rate is the market benchmark the provider starts from; a trustworthy quote names its source.",
      "The spread — usually expressed in basis points — is the provider's margin over that reference rate. It is separate from any flat transfer fee, and both should be visible before you confirm, not discovered on the statement afterwards.",
      "The recipient amount is the only number the person you're paying actually sees. When comparing providers, compare recipient amounts for the same sending amount — it folds rate, spread, and fees into one figure that cannot hide anything.",
    ],
  },
  "account-security-habits": {
    title: "Everyday Account Security Habits",
    minutes: 4,
    body: [
      "Most account compromise is mundane rather than sophisticated: a reused password, a session left signed in on a shared machine, a convincing message asking you to 'verify' a code.",
      "Three habits cover most of it. First, review your signed-in sessions and devices periodically and sign out anything you don't recognize. Second, treat any request for your password, full card security code, or authentication code as fraudulent — a legitimate institution never asks for these through chat or email.",
      "Third, use transaction-level authentication where offered. A second factor at the moment money moves means a stolen session alone cannot move it. Small, boring, effective.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  return { title: article?.title ?? "Insights" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">{article.title}</h1>
      <p className="mt-3 text-xs text-charcoal-500 dark:text-platinum-200">
        {article.minutes} min read — educational content, not financial or
        investment advice.
      </p>
      <div className="mt-8 space-y-5 leading-relaxed text-charcoal-500 dark:text-platinum-200">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
