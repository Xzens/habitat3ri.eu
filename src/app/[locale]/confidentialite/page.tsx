import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { legalContent } from "@/data/legal-content";
import LegalPage from "@/components/LegalPage";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const content = legalContent[locale] || legalContent.fr;
  return {
    title: content.confidentialite.title,
    robots: { index: true, follow: true },
  };
}

export default async function ConfidentialiteRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const content = legalContent[locale as Locale] || legalContent.fr;
  return <LegalPage title={content.confidentialite.title} sections={content.confidentialite.sections} locale={locale as Locale} />;
}
