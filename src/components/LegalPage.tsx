import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";

type LegalPageProps = {
  title: string;
  sections: { heading: string; content: string }[];
  locale: Locale;
};

const backLabel: Record<string, string> = {
  fr: "Retour à l'accueil",
  nl: "Terug naar home",
  en: "Back to home",
  de: "Zurück zur Startseite",
  lb: "Zréck op d'Haaptsäit",
};

const updatedLabel: Record<string, string> = {
  fr: "Dernière mise à jour : avril 2026",
  nl: "Laatst bijgewerkt: april 2026",
  en: "Last updated: April 2026",
  de: "Zuletzt aktualisiert: April 2026",
  lb: "Lescht aktualiséiert: Abrëll 2026",
};

/**
 * Renders static legal pages (mentions légales, confidentialité).
 * Content is developer-authored from src/data/legal-content.ts.
 * Uses a static content renderer — no user input involved.
 */
export default function LegalPage({ title, sections, locale }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
      <Link
        href={`/${locale}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel[locale] || backLabel.fr}
      </Link>

      <h1 className="mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <LegalSection key={i} heading={section.heading} content={section.content} />
        ))}
      </div>

      <div className="mt-12 border-t border-border/50 pt-6">
        <p className="text-xs text-muted-foreground">
          {updatedLabel[locale] || updatedLabel.fr}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Satyvo SA — BCE 0791.828.816 — info@satyvo.be
        </p>
      </div>
    </div>
  );
}

/**
 * Static content section renderer.
 * Content source: legal-content.ts (hardcoded, developer-authored, no user input).
 */
function LegalSection({ heading, content }: { heading: string; content: string }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-eco-green">{heading}</h2>
      <div
        className="text-sm leading-relaxed text-muted-foreground [&_a]:text-energy-blue [&_a]:underline [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1"
        // eslint-disable-next-line react/no-danger -- static legal content from legal-content.ts, not user input
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
