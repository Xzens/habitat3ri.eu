import { createClient } from "@supabase/supabase-js";
import { sampleArticles } from "@/data/sample-articles";
import type { Article } from "@/lib/supabase";

/**
 * Loads articles from Supabase + sample fallback.
 * Used by blog listing, article page, homepage preview, sitemap.
 *
 * If Supabase is not configured (env missing), returns only sampleArticles.
 * Otherwise merges (DB takes priority on slug+locale collision).
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Fetch a single article by slug + locale (DB first, then sample). */
export async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();
    if (!error && data) return data as Article;
  }
  return (
    sampleArticles.find((a) => a.slug === slug && a.locale === locale && a.status === "published") ||
    null
  );
}

/** List all published articles for a locale (for listing + related). */
export async function listArticles(locale?: string, limit = 100): Promise<Article[]> {
  const supabase = getSupabase();
  const combined = new Map<string, Article>();

  // Always include sample articles as fallback
  for (const a of sampleArticles) {
    if (a.status !== "published") continue;
    if (locale && a.locale !== locale) continue;
    combined.set(`${a.locale}:${a.slug}`, a);
  }

  if (supabase) {
    let query = supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (locale) query = query.eq("locale", locale);

    const { data } = await query;
    if (data) {
      for (const a of data as Article[]) {
        combined.set(`${a.locale}:${a.slug}`, a);
      }
    }
  }

  return Array.from(combined.values())
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
    .slice(0, limit);
}

/** Return all (locale, slug) combinations for generateStaticParams — build-time only. */
export async function listAllSlugs(): Promise<{ locale: string; slug: string }[]> {
  const supabase = getSupabase();
  const combined = new Map<string, { locale: string; slug: string }>();

  for (const a of sampleArticles) {
    if (a.status === "published") {
      combined.set(`${a.locale}:${a.slug}`, { locale: a.locale, slug: a.slug });
    }
  }

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("slug, locale")
      .eq("status", "published");
    if (data) {
      for (const { slug, locale } of data as { slug: string; locale: string }[]) {
        combined.set(`${locale}:${slug}`, { slug, locale });
      }
    }
  }

  return Array.from(combined.values());
}
