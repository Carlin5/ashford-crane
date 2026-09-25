import Link from "next/link";
import { getMessages, LOCALES, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitch } from "@/components/LocaleSwitch";

export async function MarketingHeader() {
  const locale = await getLocale();
  const t = getMessages(locale);
  const nextLocale: Locale = LOCALES.find((l) => l !== locale) ?? "en";

  const links: { href: string; label: string }[] = [
    { href: "/private-banking", label: t.nav.privateBanking },
    { href: "/corporate-banking", label: t.nav.corporateBanking },
    { href: "/international-payments", label: t.nav.internationalPayments },
    { href: "/cards", label: t.nav.cards },
    { href: "/wealth-management", label: t.nav.wealthManagement },
    { href: "/pricing", label: t.nav.pricing },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-navy-700 bg-navy-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight text-white"
        >
          Ashford &amp; Crane
        </Link>
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-platinum-200 transition-colors hover:bg-navy-700 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1 lg:ms-0">
          <LocaleSwitch label={t.locale.switch} nextLocale={nextLocale} />
          <ThemeToggle label={t.theme.toggle} />
          <Link
            href="/login"
            className="ms-2 rounded-lg border border-platinum-200/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-700"
          >
            {t.nav.clientLogin}
          </Link>
        </div>
      </div>
    </header>
  );
}
