export const locales = ["fr", "nl", "en", "de", "lb"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  nl: "Nederlands",
  en: "English",
  de: "Deutsch",
  lb: "Lëtzebuergesch",
};

export const localeFlags: Record<Locale, string> = {
  fr: "FR",
  nl: "NL",
  en: "EN",
  de: "DE",
  lb: "LU",
};

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
