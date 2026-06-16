import "server-only";
import { query } from "@/lib/db";
import { sampleArticles } from "@/data/sample-articles";
import type { Article } from "@/lib/supabase";

/**
 * Loads articles from the self-hosted Postgres (`habitat3ri` schema) with a
 * bundled sample fallback. Used by blog listing, article page, homepage
 * preview, sitemap.
 *
 * If DATABASE_URL is unset (e.g. local dev without DB), `query()` returns []
 * and these helpers fall back to sampleArticles. DB rows take priority over
 * samples on a slug+locale collision.
 *
 * The data source was migrated Supabase -> self-hosted Postgres. The columns
 * mirror the Article type 1:1 (jsonb -> objects, text[] -> arrays, timestamptz
 * -> ISO strings via the type parsers in db.ts), so `SELECT *` maps directly.
 * db.ts sets search_path=habitat3ri,public so unqualified `articles` resolves.
 */

/** Fetch a single article by slug + locale (DB first, then sample). */
export async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  const rows = await query<Article>(
    `SELECT * FROM articles WHERE slug = $1 AND locale = $2 AND status = 'published' LIMIT 1`,
    [slug, locale],
  );
  if (rows.length > 0) return rows[0];

  return (
    sampleArticles.find((a) => a.slug === slug && a.locale === locale && a.status === "published") ||
    null
  );
}

/** List all published articles for a locale (for listing + related). */
export async function listArticles(locale?: string, limit = 100): Promise<Article[]> {
  const combined = new Map<string, Article>();

  // Always include sample articles as a fallback baseline.
  for (const a of sampleArticles) {
    if (a.status !== "published") continue;
    if (locale && a.locale !== locale) continue;
    combined.set(`${a.locale}:${a.slug}`, a);
  }

  const rows = locale
    ? await query<Article>(
        `SELECT * FROM articles
          WHERE status = 'published' AND locale = $1
          ORDER BY published_at DESC NULLS LAST
          LIMIT $2`,
        [locale, limit],
      )
    : await query<Article>(
        `SELECT * FROM articles
          WHERE status = 'published'
          ORDER BY published_at DESC NULLS LAST
          LIMIT $1`,
        [limit],
      );

  // DB rows take priority over samples on a slug+locale collision.
  for (const a of rows) {
    combined.set(`${a.locale}:${a.slug}`, a);
  }

  return Array.from(combined.values())
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
    .slice(0, limit);
}

/** Return all (locale, slug) combinations for generateStaticParams — build-time. */
export async function listAllSlugs(): Promise<{ locale: string; slug: string }[]> {
  const combined = new Map<string, { locale: string; slug: string }>();

  for (const a of sampleArticles) {
    if (a.status === "published") {
      combined.set(`${a.locale}:${a.slug}`, { locale: a.locale, slug: a.slug });
    }
  }

  const rows = await query<{ slug: string; locale: string }>(
    `SELECT slug, locale FROM articles WHERE status = 'published'`,
  );
  for (const { slug, locale } of rows) {
    combined.set(`${locale}:${slug}`, { slug, locale });
  }

  return Array.from(combined.values());
}
