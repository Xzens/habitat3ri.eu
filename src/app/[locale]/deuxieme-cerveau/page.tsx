import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SecondBrainPage from "@/components/brain/SecondBrainPage";

export async function generateStaticParams() {
  return [
    { locale: "fr" },
    { locale: "nl" },
    { locale: "en" },
    { locale: "de" },
    { locale: "lb" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.brain.pageTitle,
    description: dict.brain.pageDescription,
    alternates: {
      canonical: `https://habitat3ri.eu/${locale}/deuxieme-cerveau`,
      languages: { fr: "/fr/deuxieme-cerveau", nl: "/nl/deuxieme-cerveau" },
    },
  };
}

export default async function DeuxiemeCerveauRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  return <SecondBrainPage locale={typedLocale} dict={dict} />;
}
