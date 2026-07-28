import { CheckCircle2 } from "lucide-react";
import MultiStepLeadForm from "@/components/MultiStepLeadForm";
import type { Locale } from "@/i18n/config";

/**
 * Conversion block appended to every blog article.
 *
 * Article pages are the organic entry points, so without this the reader has no
 * way to request a quote without navigating back to the home page. The Bobex
 * category is preselected from the article topic so the form opens already
 * scoped to what the reader was just researching.
 *
 * Insurance categories are deliberately never mapped here: insurance is FSMA
 * regulated and stays out of direct quote routing.
 */

const CATEGORY_MAP: Record<string, string> = {
  solar: "panneaux-solaires",
  prosumer: "panneaux-solaires",
  smartgrid: "panneaux-solaires",
  heatpump: "pompe-a-chaleur",
  battery: "batterie-domestique",
  insulation: "isolation",
  renovation: "renovation-totale",
  subsidy: "renovation-totale",
  security: "alarme",
  // `digital` has no matching trade category — the reader picks one in step 3.
};

const COPY = {
  title: {
    fr: "Passez à l'action sur votre projet",
    nl: "Zet de stap naar uw project",
    en: "Take action on your project",
    de: "Machen Sie den nächsten Schritt",
    lb: "Maacht de nächste Schrëtt",
  },
  subtitle: {
    fr: "Recevez jusqu'à 5 devis d'installateurs certifiés près de chez vous. Comparez, puis décidez.",
    nl: "Ontvang tot 5 offertes van gecertificeerde installateurs bij u in de buurt. Vergelijk en beslis.",
    en: "Get up to 5 quotes from certified installers near you. Compare, then decide.",
    de: "Erhalten Sie bis zu 5 Angebote von zertifizierten Installateuren in Ihrer Nähe. Vergleichen und entscheiden.",
    lb: "Kritt bis zu 5 Offerten vun zertifizéierten Installateuren bei Iech an der Noperschaft. Vergläicht a decidéiert.",
  },
  benefits: {
    fr: ["100% gratuit et sans engagement", "Installateurs certifiés", "Réponse sous 24h"],
    nl: ["100% gratis en vrijblijvend", "Gecertificeerde installateurs", "Antwoord binnen 24u"],
    en: ["100% free, no obligation", "Certified installers", "Response within 24h"],
    de: ["100% kostenlos und unverbindlich", "Zertifizierte Installateure", "Antwort innerhalb von 24 Stunden"],
    lb: ["100% gratis an ouni Engagement", "Zertifizéiert Installateuren", "Äntwert bannent 24St"],
  },
} as const;

type ArticleCTAProps = {
  locale: Locale;
  category: string;
};

export default function ArticleCTA({ locale, category }: ArticleCTAProps) {
  const preselectedCategory = CATEGORY_MAP[category];

  return (
    <section
      id="devis"
      aria-labelledby="article-cta-title"
      className="mb-12 scroll-mt-24 overflow-hidden rounded-2xl border border-eco-green/20 bg-gradient-to-br from-eco-green/10 via-energy-blue/5 to-transparent"
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 id="article-cta-title" className="text-2xl font-bold sm:text-3xl">
            {COPY.title[locale]}
          </h2>
          <p className="mt-3 text-muted-foreground">{COPY.subtitle[locale]}</p>

          <ul className="mt-6 space-y-2.5">
            {COPY.benefits[locale].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-eco-green" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/80 p-4 backdrop-blur-sm sm:p-5">
          <MultiStepLeadForm locale={locale} preselectedCategory={preselectedCategory} />
        </div>
      </div>
    </section>
  );
}
