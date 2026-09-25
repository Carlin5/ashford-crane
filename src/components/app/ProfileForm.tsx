"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n";

export function ProfileForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  return (
    <div className="mt-4 flex items-center gap-4">
      <span className="text-sm">Language</span>
      <div className="flex gap-2" role="group" aria-label="Language">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={l === locale}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
              router.refresh();
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              l === locale
                ? "border-champagne-500 font-medium"
                : "border-platinum-200 text-charcoal-500 dark:border-navy-700 dark:text-platinum-200"
            }`}
          >
            {l === "en" ? "English" : "العربية"}
          </button>
        ))}
      </div>
    </div>
  );
}
