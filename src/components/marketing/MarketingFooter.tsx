import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { positioningStatement, PLACEHOLDER } from "@/lib/compliance";

export async function MarketingFooter() {
  const locale = await getLocale();
  const t = getMessages(locale);

  const legal = [
    { href: "/legal/privacy", label: t.footer.privacy },
    { href: "/legal/terms", label: t.footer.terms },
    { href: "/legal/cookies", label: t.footer.cookies },
    { href: "/legal/complaints", label: t.footer.complaints },
    { href: "/legal/regulatory", label: t.footer.regulatory },
    { href: "/legal/aml-kyc", label: t.footer.amlKyc },
    { href: "/legal/jurisdictions", label: t.footer.jurisdictions },
  ];
  const company = [
    { href: "/about", label: t.nav.about },
    { href: "/security", label: t.nav.security },
    { href: "/faq", label: t.nav.faq },
    { href: "/insights", label: t.nav.insights },
    { href: "/developers", label: t.nav.developers },
    { href: "/contact", label: t.nav.contact },
  ];
  const services = [
    { href: "/private-banking", label: t.nav.privateBanking },
    { href: "/corporate-banking", label: t.nav.corporateBanking },
    { href: "/international-payments", label: t.nav.internationalPayments },
    { href: "/cards", label: t.nav.cards },
    { href: "/wealth-management", label: t.nav.wealthManagement },
    { href: "/pricing", label: t.nav.pricing },
  ];

  return (
    <footer className="border-t border-navy-700 bg-navy-900 text-platinum-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-medium text-white">
              Ashford &amp; Crane
            </p>
            <p className="mt-2 text-sm">{t.footer.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed">
              Legal entity name: {PLACEHOLDER}
              <br />
              Registered office: {PLACEHOLDER}
              <br />
              Regulatory status: {PLACEHOLDER}
            </p>
          </div>
          <nav aria-label="Services">
            <h2 className="text-sm font-medium text-white">{t.footer.services}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="text-sm font-medium text-white">{t.footer.company}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2 className="text-sm font-medium text-white">{t.footer.legal}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-navy-700 pt-6 text-xs leading-relaxed">
          <p>{positioningStatement()}</p>
          <p className="mt-3">
            Ashford &amp; Crane is the technology and client-experience layer.
            Banking, custody, card issuing, payments, and screening services
            named anywhere on this site are provided by separately regulated
            partner institutions, not by Ashford &amp; Crane itself. Partner
            names, regulators, and license numbers are published here once
            confirmed; until then they appear as {PLACEHOLDER}.
          </p>
        </div>
      </div>
    </footer>
  );
}
