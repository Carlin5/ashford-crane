import en from "./en.json";
import ar from "./ar.json";

export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "ac_locale";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = { en, ar };

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
