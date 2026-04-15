import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { sampleArticles } from "@/data/sample-articles";
import BlogList from "@/components/blog/BlogList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.blog.title} — ${locale === "fr" ? "Articles et guides" : "Artikelen en gidsen"}`,
    description: dict.blog.subtitle,
    alternates: {
      canonical: `https://habitat3ri.eu/${locale}/blog`,
      languages: { fr: "/fr/blog", nl: "/nl/blog" },
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  const articles = sampleArticles
    .filter((a) => a.locale === typedLocale && a.status === "published")
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{dict.blog.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{dict.blog.subtitle}</p>
      </div>
      <BlogList articles={articles} locale={typedLocale} dict={dict} />
    </div>
  );
}
