import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { sampleArticles } from "@/data/sample-articles";

const BASE_URL = "https://habitat3ri.eu";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const articlePages = sampleArticles
    .filter((a) => a.status === "published")
    .map((article) => ({
      url: `${BASE_URL}/${article.locale}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...articlePages];
}
