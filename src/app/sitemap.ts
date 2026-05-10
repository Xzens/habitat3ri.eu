import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { listArticles } from "@/lib/articles";

const BASE_URL = "https://habitat3ri.eu";

// Revalider le sitemap toutes les 5 min pour inclure les nouveaux articles xAI
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Homepage + blog listing per locale (with hreflang)
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}`])),
      },
    },
    {
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}/blog`])),
      },
    },
  ]);

  // Legal pages per locale (with hreflang)
  const legalPages = locales.flatMap((locale) =>
    ["mentions-legales", "confidentialite"].map((page) => ({
      url: `${BASE_URL}/${locale}/${page}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}/${page}`])),
      },
    }))
  );

  // Blog articles — fetched dynamically (Supabase + sample fallback)
  // Get all published articles across all locales (no locale filter = all)
  const allArticles = await listArticles(undefined, 500);
  const articlePages = allArticles.map((article) => ({
    url: `${BASE_URL}/${article.locale}/blog/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...legalPages, ...articlePages];
}
