import Link from "next/link";
import { Zap, ExternalLink, Mail } from "lucide-react";
import { constellation } from "@/data/constellation";
import type { Locale } from "@/i18n/config";

type FooterProps = {
  locale: Locale;
  dict: {
    footer: {
      tagline: string;
      rights: string;
      privacy: string;
      terms: string;
      cookies: string;
      sections: { ecosystem: string; resources: string; legal: string };
    };
    newsletter: {
      title: string;
      subtitle: string;
      placeholder: string;
      cta: string;
    };
  };
};

export default function Footer({ locale, dict }: FooterProps) {
  const sites = constellation
    .filter((s) => s.lang === locale || s.lang === "multi")
    .slice(0, 8);

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-eco-green to-energy-blue">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">Habitat</span>
                <span className="text-solar-orange">3RI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Ecosystem links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {dict.footer.sections.ecosystem}
            </h3>
            <ul className="space-y-2.5">
              {sites.map((site) => (
                <li key={site.url}>
                  <a
                    href={`${site.url}?utm_source=habitat3ri.eu&utm_medium=footer&utm_campaign=constellation`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {site.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {dict.footer.sections.resources}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-muted-foreground hover:text-foreground">
                  Blog 3RI
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#piliers`} className="text-sm text-muted-foreground hover:text-foreground">
                  {{ fr: "Les 5 Piliers Rifkin", nl: "De 5 Rifkin Pijlers", en: "The 5 Rifkin Pillars", de: "Die 5 Rifkin-Säulen", lb: "Déi 5 Rifkin-Pilieren" }[locale]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#solutions`} className="text-sm text-muted-foreground hover:text-foreground">
                  {{ fr: "Nos Solutions", nl: "Onze Oplossingen", en: "Our Solutions", de: "Unsere Lösungen", lb: "Eis Léisungen" }[locale]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#calculateur`} className="text-sm text-muted-foreground hover:text-foreground">
                  {{ fr: "Calculateur Solaire", nl: "Zonnerekenmachine", en: "Solar Calculator", de: "Solarrechner", lb: "Sonnerechner" }[locale]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#contact`} className="text-sm text-muted-foreground hover:text-foreground">
                  {{ fr: "Devis Gratuit", nl: "Gratis Offerte", en: "Free Quote", de: "Kostenloses Angebot", lb: "Gratis Offert" }[locale]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {dict.newsletter.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{dict.newsletter.subtitle}</p>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex gap-2"
            >
              <input type="hidden" name="locale" value={locale} />
              <div className="flex flex-1 items-center rounded-lg border border-border bg-background px-3">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={dict.newsletter.placeholder}
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-eco-green to-energy-blue px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {dict.newsletter.cta}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mt-12" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Habitat3RI. {dict.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href={`/${locale}/confidentialite`} className="text-xs text-muted-foreground hover:text-foreground">
              {dict.footer.privacy}
            </Link>
            <Link href={`/${locale}/mentions-legales`} className="text-xs text-muted-foreground hover:text-foreground">
              {dict.footer.terms}
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("habitat3ri-cookie-consent");
                  window.location.reload();
                }
              }}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {dict.footer.cookies}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
