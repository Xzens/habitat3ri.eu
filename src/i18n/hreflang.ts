import { locales, defaultLocale, type Locale } from "./config";

const BASE_URL = "https://habitat3ri.eu";

/**
 * Build the `alternates` object expected by Next.js `Metadata`, including
 * canonical + per-locale hreflang + x-default.
 *
 * IMPORTANT — only pass locales where the page ACTUALLY exists.
 *
 * The previous version always emitted the 5 locales by swapping the locale
 * prefix on the same path. That is correct for pages whose path is identical
 * across locales (home, /blog, legal pages), but wrong for blog articles:
 * their slugs are translated, so /nl/blog/<french-slug> does not exist. That
 * produced 136 hreflang targets returning 404 out of 190 declared (71.6%), and
 * Google discards a cluster whose alternates are not reciprocal.
 *
 * Articles therefore declare only their own locale until translations are
 * explicitly linked (the Article model has no field pairing a FR article with
 * its NL counterpart — adding one is what would allow real cross-locale
 * hreflang here).
 *
 * @param path Path relative to a locale prefix, starting with "/" (e.g. "/blog").
 *             Pass "" for the locale root.
 * @param currentLocale The locale of the page being rendered (used for canonical).
 * @param availableLocales Locales where this exact path exists. Defaults to all
 *             locales, which is only valid for locale-invariant paths.
 */
export function buildAlternates(
  path: string,
  currentLocale: Locale,
  availableLocales: readonly Locale[] = locales,
) {
  const cleanPath = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[l] = `${BASE_URL}/${l}${cleanPath}`;
  }

  // x-default only makes sense when the default locale actually serves this path.
  if (availableLocales.includes(defaultLocale)) {
    languages["x-default"] = `${BASE_URL}/${defaultLocale}${cleanPath}`;
  }

  return {
    canonical: `${BASE_URL}/${currentLocale}${cleanPath}`,
    languages,
  };
}
