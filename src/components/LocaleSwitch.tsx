"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/** Stores the locale in a cookie and reloads so server-rendered copy swaps. */
export function LocaleSwitch({
  label,
  nextLocale,
}: {
  label: string;
  nextLocale: Locale;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
      }}
      className="rounded-lg px-2.5 py-1.5 text-sm text-platinum-200 transition-colors hover:bg-navy-700"
    >
      {label}
    </button>
  );
}
