import { User, MapPin, Building2, Bot } from "lucide-react";
import type { Author } from "@/data/authors";
import type { Locale } from "@/i18n/config";

type AuthorCardProps = {
  author: Author;
  locale: Locale;
  variant?: "compact" | "full";
};

const labels: Record<string, {
  authorPrefix: string;
  aiDisclosure: string;
  company: string;
  location: string;
}> = {
  fr: {
    authorPrefix: "Publié par",
    aiDisclosure: "Cet article a été rédigé avec assistance IA (xAI Grok) puis relu et supervisé par la rédaction de Satyvo SA avant publication. Conformément au règlement européen sur l'intelligence artificielle (AI Act 2026), nous rendons cette pratique transparente. Les chiffres et références sont vérifiés auprès de sources officielles. Les estimations de prix (±25-35%) sont indicatives.",
    company: "Entité éditrice",
    location: "Siège social",
  },
  nl: {
    authorPrefix: "Gepubliceerd door",
    aiDisclosure: "Dit artikel is geschreven met AI-assistentie (xAI Grok) en vervolgens nagelezen en gesuperviseerd door de redactie van Satyvo SA voor publicatie. In overeenstemming met de Europese AI-verordening (AI Act 2026) maken wij deze praktijk transparant. Cijfers en referenties worden geverifieerd bij officiële bronnen. Prijsindicaties (±25-35%) zijn indicatief.",
    company: "Uitgevende entiteit",
    location: "Hoofdkantoor",
  },
  en: {
    authorPrefix: "Published by",
    aiDisclosure: "This article was written with AI assistance (xAI Grok), then reviewed and supervised by the Satyvo SA editorial team before publication. In compliance with the EU AI Act 2026, we disclose this practice transparently. Figures and references are verified against official sources. Price estimates (±25-35%) are indicative.",
    company: "Publishing entity",
    location: "Registered office",
  },
  de: {
    authorPrefix: "Veröffentlicht von",
    aiDisclosure: "Dieser Artikel wurde mit KI-Unterstützung (xAI Grok) verfasst und anschließend von der Redaktion der Satyvo SA vor der Veröffentlichung überprüft und betreut. Gemäß der EU-KI-Verordnung (AI Act 2026) legen wir diese Praxis transparent offen. Zahlen und Referenzen werden anhand offizieller Quellen überprüft. Preisschätzungen (±25-35%) sind unverbindlich.",
    company: "Herausgeberin",
    location: "Sitz",
  },
  lb: {
    authorPrefix: "Verëffentlecht vun",
    aiDisclosure: "Dësen Artikel gouf mat AI-Assistenz (xAI Grok) geschriwwen, duerno iwwerpréift a gesupervised vun der Redaktioun vun Satyvo SA virun der Verëffentlechung. Konform zum EU AI Act 2026 maache mir dës Praxis transparent. Zuelen a Referenzen gi bei offizielle Quelle verifizéiert. Präisschätzungen (±25-35%) sinn indikativ.",
    company: "Erausgiewer",
    location: "Siege sozial",
  },
};

export default function AuthorCard({ author, locale, variant = "full" }: AuthorCardProps) {
  const role = author.role[locale] || author.role.fr;
  const bio = author.bio[locale] || author.bio.fr;
  const t = labels[locale] || labels.fr;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-eco-green to-energy-blue text-white">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">{author.name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-border/50 bg-card">
      {/* Author identity */}
      <div className="p-6">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-eco-green">
          {t.authorPrefix}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-eco-green to-energy-blue text-white shadow-lg">
            <User className="h-8 w-8" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold">{author.name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>

            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{bio}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {author.location}
              </span>
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-energy-blue hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" />
                {author.organization.name}
              </a>
            </div>

            {/* Expertise tags */}
            {author.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {author.expertise.slice(0, 6).map((exp) => (
                  <span
                    key={exp}
                    className="rounded-md bg-eco-green/10 px-2 py-0.5 text-xs font-medium text-eco-green"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legal entity — Satyvo SA */}
      <div className="border-t border-border/30 bg-muted/30 px-6 py-4">
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            <span className="font-semibold text-foreground">{t.company} :</span>{" "}
            {author.organization.name} ({author.organization.legalForm})
          </div>
          <div>
            <span className="font-semibold text-foreground">BCE / TVA :</span>{" "}
            {author.organization.bce} — {author.organization.vat}
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-foreground">{t.location} :</span>{" "}
            {author.organization.address}
          </div>
        </div>
      </div>

      {/* AI disclosure — EU AI Act 2026 compliant */}
      <div className="border-t border-border/30 bg-eco-green/5 px-6 py-4">
        <div className="flex items-start gap-3">
          <Bot className="mt-0.5 h-4 w-4 shrink-0 text-eco-green" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.aiDisclosure}
          </p>
        </div>
      </div>
    </div>
  );
}
