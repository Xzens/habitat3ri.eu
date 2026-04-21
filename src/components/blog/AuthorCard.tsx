import { User, MapPin, Calendar, ExternalLink } from "lucide-react";
import type { Author } from "@/data/authors";
import type { Locale } from "@/i18n/config";

type AuthorCardProps = {
  author: Author;
  locale: Locale;
  variant?: "compact" | "full";
};

const roleLabels: Record<string, string> = {
  fr: "Auteur :",
  nl: "Auteur:",
  en: "Author:",
  de: "Autor:",
  lb: "Auteur:",
};

const yearsLabels: Record<string, string> = {
  fr: "ans d'expérience",
  nl: "jaar ervaring",
  en: "years experience",
  de: "Jahre Erfahrung",
  lb: "Joer Erfahrung",
};

export default function AuthorCard({ author, locale, variant = "full" }: AuthorCardProps) {
  const role = author.role[locale] || author.role.fr;
  const bio = author.bio[locale] || author.bio.fr;

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
    <div className="my-10 rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-eco-green">
        {roleLabels[locale] || roleLabels.fr}
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
              <Calendar className="h-3.5 w-3.5" />
              {author.years_experience} {yearsLabels[locale] || yearsLabels.fr}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {author.location}
            </span>
            {author.linkedin && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-energy-blue hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}
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
  );
}
