import { locales, defaultLocale, type Locale } from "./config";

const BASE_URL = "https://habitat3ri.eu";

/**
 * Build the `alternates` object expected by Next.js `Metadata`, including
 * canonical + per-locale hreflang + x-default.
 *
 * @param path Path relative to a locale prefix, starting with "/" (e.g. "/blog/my-slug").
 *             Pass "" for the locale root.
 * @param currentLocale The locale of the page currently being rendered (used for canonical).
 */
export function buildAlternates(path: string, currentLocale: Locale) {
  const cleanPath = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}${cleanPath}`;
  }
  // x-default points to the default locale (fr).
  languages["x-default"] = `${BASE_URL}/${defaultLocale}${cleanPath}`;

  return {
    canonical: `${BASE_URL}/${currentLocale}${cleanPath}`,
    languages,
  };
}
