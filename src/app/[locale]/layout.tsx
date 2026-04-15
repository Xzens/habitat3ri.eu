import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";

export async function generateStaticParams() {
  return [
    { locale: "fr" },
    { locale: "nl" },
    { locale: "en" },
    { locale: "de" },
    { locale: "lb" },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header locale={locale as Locale} dict={dict} />
          <main>{children}</main>
          <Footer locale={locale as Locale} dict={dict} />
          <CookieConsent locale={locale as Locale} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
