import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { sampleArticles } from "@/data/sample-articles";
import ArticlePage from "@/components/blog/ArticlePage";

export async function generateStaticParams() {
  return sampleArticles.map((a) => ({
    locale: a.locale,
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = sampleArticles.find((a) => a.slug === slug && a.locale === locale);
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
      publishedTime: article.published_at,
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
  const article = sampleArticles.find((a) => a.slug === slug && a.locale === typedLocale);
  if (!article) notFound();

  const dict = await getDictionary(typedLocale);

  const relatedArticles = sampleArticles
    .filter((a) => a.locale === typedLocale && a.slug !== slug && a.status === "published")
    .slice(0, 3);

  return (
    <ArticlePage article={article} dict={dict} locale={typedLocale} relatedArticles={relatedArticles} />
  );
}
