export const locales = ["fr", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
