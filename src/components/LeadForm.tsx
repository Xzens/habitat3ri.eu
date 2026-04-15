"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { bobexCategories, bobexGroupLabels, type BobexCategory } from "@/data/bobex-categories";
import type { Locale } from "@/i18n/config";

type LeadFormProps = {
  locale: Locale;
  preselectedCategory?: string;
};

const formLabels: Record<string, Record<string, string>> = {
  fr: { title: "Recevez jusqu'à 5 devis gratuits", subtitle: "Comparez les prix et économisez jusqu'à 40%", firstName: "Prénom", lastName: "Nom", email: "Email", phone: "Téléphone", postalCode: "Code postal", country: "Pays", category: "Type de travaux", remarks: "Description du projet (optionnel)", consent: "J'accepte d'être contacté par des professionnels qualifiés et je consens au traitement de mes données.", submit: "Recevoir mes devis gratuits", success: "Merci ! Votre demande a été envoyée. Vous recevrez jusqu'à 5 devis sous 48h.", error: "Erreur. Veuillez réessayer.", sending: "Envoi en cours..." },
  nl: { title: "Ontvang tot 5 gratis offertes", subtitle: "Vergelijk prijzen en bespaar tot 40%", firstName: "Voornaam", lastName: "Achternaam", email: "E-mail", phone: "Telefoon", postalCode: "Postcode", country: "Land", category: "Type werkzaamheden", remarks: "Beschrijving van het project (optioneel)", consent: "Ik ga akkoord om gecontacteerd te worden door gekwalificeerde professionals en geef toestemming voor de verwerking van mijn gegevens.", submit: "Mijn gratis offertes ontvangen", success: "Bedankt! Uw aanvraag is verzonden. U ontvangt tot 5 offertes binnen 48u.", error: "Fout. Probeer het opnieuw.", sending: "Verzenden..." },
  en: { title: "Get up to 5 free quotes", subtitle: "Compare prices and save up to 40%", firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone", postalCode: "Postal code", country: "Country", category: "Type of work", remarks: "Project description (optional)", consent: "I agree to be contacted by qualified professionals and consent to the processing of my data.", submit: "Get my free quotes", success: "Thank you! Your request has been sent. You'll receive up to 5 quotes within 48h.", error: "Error. Please try again.", sending: "Sending..." },
  de: { title: "Erhalten Sie bis zu 5 kostenlose Angebote", subtitle: "Vergleichen Sie Preise und sparen Sie bis zu 40%", firstName: "Vorname", lastName: "Nachname", email: "E-Mail", phone: "Telefon", postalCode: "Postleitzahl", country: "Land", category: "Art der Arbeiten", remarks: "Projektbeschreibung (optional)", consent: "Ich stimme zu, von qualifizierten Fachleuten kontaktiert zu werden und willige in die Verarbeitung meiner Daten ein.", submit: "Meine kostenlosen Angebote erhalten", success: "Danke! Ihre Anfrage wurde gesendet. Sie erhalten bis zu 5 Angebote innerhalb von 48 Stunden.", error: "Fehler. Bitte versuchen Sie es erneut.", sending: "Wird gesendet..." },
  lb: { title: "Kritt bis zu 5 gratis Offeren", subtitle: "Vergläicht Präisser a spart bis zu 40%", firstName: "Virnumm", lastName: "Nonumm", email: "Email", phone: "Telefon", postalCode: "Postleitzuel", country: "Land", category: "Aart vun den Aarbechten", remarks: "Projetbeschreiwung (optional)", consent: "Ech akzeptéieren vun qualifizéierte Fachleit kontaktéiert ze ginn.", submit: "Meng gratis Offere kréien", success: "Merci! Är Ufro gouf geschéckt. Dir kritt bis zu 5 Offeren bannent 48 Stonnen.", error: "Feeler. Probéiert w.e.g. nach eng Kéier.", sending: "Gëtt geschéckt..." },
};

const countries = [
  { code: "BE", labels: { fr: "Belgique", nl: "België", en: "Belgium", de: "Belgien", lb: "Belsch" } },
  { code: "NL", labels: { fr: "Pays-Bas", nl: "Nederland", en: "Netherlands", de: "Niederlande", lb: "Holland" } },
  { code: "LU", labels: { fr: "Luxembourg", nl: "Luxemburg", en: "Luxembourg", de: "Luxemburg", lb: "Lëtzebuerg" } },
  { code: "FR", labels: { fr: "France", nl: "Frankrijk", en: "France", de: "Frankreich", lb: "Frankräich" } },
];

function groupCategories(locale: string): { group: string; label: string; items: BobexCategory[] }[] {
  const groups = new Map<string, BobexCategory[]>();
  for (const cat of bobexCategories) {
    if (!groups.has(cat.group)) groups.set(cat.group, []);
    groups.get(cat.group)!.push(cat);
  }
  return Array.from(groups.entries()).map(([group, items]) => ({
    group,
    label: bobexGroupLabels[group]?.[locale] || bobexGroupLabels[group]?.fr || group,
    items,
  }));
}

export default function LeadForm({ locale, preselectedCategory }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = formLabels[locale] || formLabels.fr;
  const grouped = groupCategories(locale);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-eco-green to-energy-blue p-6 text-white">
        <h3 className="text-xl font-bold">{t.title}</h3>
        <p className="mt-1 text-sm text-white/80">{t.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Honeypot */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.firstName}</label>
            <Input name="firstName" required placeholder={t.firstName} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.lastName}</label>
            <Input name="lastName" required placeholder={t.lastName} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.email}</label>
            <Input name="email" type="email" required placeholder={t.email} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.phone}</label>
            <Input name="phone" type="tel" required placeholder="+32 ..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.postalCode}</label>
            <Input name="postalCode" required placeholder="1000" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t.country}</label>
            <select
              name="country"
              required
              defaultValue="BE"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.labels[locale as keyof typeof c.labels] || c.labels.fr}
                </option>
              ))}
            </select>
          </div>

          {/* Category selector — grouped */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">{t.category}</label>
            <select
              name="categoryId"
              required
              defaultValue={preselectedCategory || ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>— {t.category} —</option>
              {grouped.map((group) => (
                <optgroup key={group.group} label={group.label}>
                  {group.items.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label[locale as keyof typeof cat.label] || cat.label.fr}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">{t.remarks}</label>
            <Textarea name="remarks" rows={3} placeholder={t.remarks} />
          </div>
        </div>

        {/* Consent */}
        <div className="mt-4 flex items-start gap-2">
          <input type="checkbox" id="lead-consent" name="consent" value="on" required className="mt-1" />
          <label htmlFor="lead-consent" className="text-xs text-muted-foreground">{t.consent}</label>
        </div>

        {/* Submit */}
        <div className="mt-6">
          {status === "success" ? (
            <div className="flex items-center gap-2 rounded-lg bg-eco-green/10 p-4 text-sm text-eco-green">
              <CheckCircle2 className="h-5 w-5" /> {t.success}
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" /> {t.error}
                </div>
              )}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-eco-green to-energy-blue text-white hover:opacity-90"
                size="lg"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.sending}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> {t.submit}
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
