import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://habitat3ri.eu"),
  title: {
    default: "Habitat 3RI — Votre maison, votre centrale énergétique",
    template: "%s | Habitat 3RI",
  },
  description:
    "Le hub central de la rénovation durable et de la Troisième Révolution Industrielle. Transformez votre habitat en mini-centrale électrique au Benelux et en France.",
  openGraph: {
    type: "website",
    siteName: "Habitat 3RI",
    locale: "fr_BE",
    alternateLocale: ["nl_BE", "nl_NL", "fr_FR"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Habitat 3RI",
            "alternateName": "Satyvo SA",
            "url": "https://habitat3ri.eu",
            "description": "Le hub central de la rénovation durable et de la Troisième Révolution Industrielle au Benelux et en France.",
            "foundingDate": "2025",
            "areaServed": [
              { "@type": "Country", "name": "Belgium" },
              { "@type": "Country", "name": "Netherlands" },
              { "@type": "Country", "name": "Luxembourg" },
              { "@type": "Country", "name": "France" }
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "info@satyvo.be",
              "contactType": "customer service",
              "availableLanguage": ["French", "Dutch", "English", "German", "Luxembourgish"]
            },
            "sameAs": ["https://github.com/Xzens/habitat3ri.eu"]
          })}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
