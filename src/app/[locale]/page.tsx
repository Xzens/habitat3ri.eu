import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import Solutions from "@/components/sections/Solutions";
import BlogPreview from "@/components/sections/BlogPreview";
import Partners from "@/components/sections/Partners";
import SolteoCalculator from "@/components/sections/SolteoCalculator";
import Contact from "@/components/sections/Contact";
import { sampleArticles } from "@/data/sample-articles";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: `https://habitat3ri.eu/${locale}`,
      languages: { fr: "/fr", nl: "/nl" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `https://habitat3ri.eu/${locale}`,
      locale: locale === "fr" ? "fr_BE" : "nl_BE",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  const articles = sampleArticles
    .filter((a) => a.locale === typedLocale && a.status === "published")
    .slice(0, 3);

  return (
    <>
      <Hero dict={dict} />
      <div className="section-divider" />
      <Pillars dict={dict} />
      <div className="section-divider" />
      <Solutions locale={typedLocale} dict={dict} />
      <div className="section-divider" />
      <SolteoCalculator locale={typedLocale} dict={dict} />
      <div className="section-divider" />
      <BlogPreview locale={typedLocale} dict={dict} articles={articles} />
      <div className="section-divider" />
      <Partners dict={dict} locale={typedLocale} />
      <div className="section-divider" />
      <Contact locale={typedLocale} dict={dict} />
    </>
  );
}
