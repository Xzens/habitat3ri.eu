import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { sampleArticles } from "@/data/sample-articles";

const BASE_URL = "https://habitat3ri.eu";

export default function sitemap(): MetadataRoute.Sitemap {
  const hreflangAll = Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}`]));

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

  // Blog articles
  const articlePages = sampleArticles
    .filter((a) => a.status === "published")
    .map((article) => ({
      url: `${BASE_URL}/${article.locale}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...legalPages, ...articlePages];
}
