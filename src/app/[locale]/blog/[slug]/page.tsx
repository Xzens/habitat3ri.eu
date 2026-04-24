import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getArticleBySlug, listArticles, listAllSlugs } from "@/lib/articles";
import ArticlePage from "@/components/blog/ArticlePage";

// Next.js 16 : articles publiés dynamiquement via CRON → génère à la demande
export const dynamicParams = true;
export const revalidate = 300; // re-génère la page toutes les 5 min

export async function generateStaticParams() {
  return listAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.seo_keywords.join(", "),
    alternates: {
      canonical: `https://habitat3ri.eu/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_at || undefined,
      locale: locale === "fr" ? "fr_BE" : "nl_BE",
      images: article.cover_image ? [{ url: article.cover_image }] : [],
    },
  };
}

export default async function ArticlePageRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const article = await getArticleBySlug(slug, typedLocale);
  if (!article) notFound();

  const dict = await getDictionary(typedLocale);

  const allForLocale = await listArticles(typedLocale, 20);
  const relatedArticles = allForLocale.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <ArticlePage article={article} dict={dict} locale={typedLocale} relatedArticles={relatedArticles} />
  );
}
