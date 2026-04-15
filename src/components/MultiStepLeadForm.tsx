"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, ChevronRight, ChevronLeft, User, MapPin, Wrench, FileCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { bobexCategories, bobexGroupLabels } from "@/data/bobex-categories";
import type { Locale } from "@/i18n/config";

type MultiStepLeadFormProps = {
  locale: Locale;
  preselectedCategory?: string;
};

const labels: Record<string, Record<string, string>> = {
  fr: {
    title: "Recevez jusqu'à 5 devis gratuits",
    step1: "Vos coordonnées", step2: "Votre localisation", step3: "Votre projet", step4: "Confirmation",
    firstName: "Prénom", lastName: "Nom", email: "Email", phone: "Téléphone",
    country: "Pays", postalCode: "Code postal", city: "Ville (optionnel)",
    category: "Type de travaux", remarks: "Décrivez votre projet (optionnel)",
    consent: "J'accepte d'être contacté par des professionnels qualifiés et je consens au traitement de mes données (RGPD).",
    next: "Suivant", prev: "Retour", submit: "Envoyer ma demande",
    success: "Merci ! Votre demande a été envoyée avec succès. Vous recevrez jusqu'à 5 devis sous 48h.",
    error: "Erreur. Veuillez réessayer.", sending: "Envoi en cours...",
    be: "Belgique", nl: "Pays-Bas", lu: "Luxembourg", fr: "France",
    free: "100% gratuit", noObligation: "Sans engagement", fast: "Réponse sous 48h",
  },
  nl: {
    title: "Ontvang tot 5 gratis offertes",
    step1: "Uw gegevens", step2: "Uw locatie", step3: "Uw project", step4: "Bevestiging",
    firstName: "Voornaam", lastName: "Achternaam", email: "E-mail", phone: "Telefoon",
    country: "Land", postalCode: "Postcode", city: "Stad (optioneel)",
    category: "Type werkzaamheden", remarks: "Beschrijf uw project (optioneel)",
    consent: "Ik ga akkoord om gecontacteerd te worden door gekwalificeerde professionals (AVG).",
    next: "Volgende", prev: "Terug", submit: "Mijn aanvraag versturen",
    success: "Bedankt! Uw aanvraag is verzonden. U ontvangt tot 5 offertes binnen 48u.",
    error: "Fout. Probeer het opnieuw.", sending: "Verzenden...",
    be: "België", nl: "Nederland", lu: "Luxemburg", fr: "Frankrijk",
    free: "100% gratis", noObligation: "Vrijblijvend", fast: "Antwoord binnen 48u",
  },
  en: {
    title: "Get up to 5 free quotes",
    step1: "Your details", step2: "Your location", step3: "Your project", step4: "Confirmation",
    firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone",
    country: "Country", postalCode: "Postal code", city: "City (optional)",
    category: "Type of work", remarks: "Describe your project (optional)",
    consent: "I agree to be contacted by qualified professionals (GDPR).",
    next: "Next", prev: "Back", submit: "Send my request",
    success: "Thank you! Your request has been sent. You'll receive up to 5 quotes within 48h.",
    error: "Error. Please try again.", sending: "Sending...",
    be: "Belgium", nl: "Netherlands", lu: "Luxembourg", fr: "France",
    free: "100% free", noObligation: "No obligation", fast: "Response within 48h",
  },
  de: {
    title: "Erhalten Sie bis zu 5 kostenlose Angebote",
    step1: "Ihre Daten", step2: "Ihr Standort", step3: "Ihr Projekt", step4: "Bestätigung",
    firstName: "Vorname", lastName: "Nachname", email: "E-Mail", phone: "Telefon",
    country: "Land", postalCode: "PLZ", city: "Stadt (optional)",
    category: "Art der Arbeiten", remarks: "Beschreiben Sie Ihr Projekt (optional)",
    consent: "Ich stimme der Kontaktaufnahme durch qualifizierte Fachleute zu (DSGVO).",
    next: "Weiter", prev: "Zurück", submit: "Anfrage absenden",
    success: "Danke! Ihre Anfrage wurde gesendet. Sie erhalten bis zu 5 Angebote innerhalb von 48h.",
    error: "Fehler. Bitte versuchen Sie es erneut.", sending: "Wird gesendet...",
    be: "Belgien", nl: "Niederlande", lu: "Luxemburg", fr: "Frankreich",
    free: "100% kostenlos", noObligation: "Unverbindlich", fast: "Antwort in 48h",
  },
  lb: {
    title: "Kritt bis zu 5 gratis Offeren",
    step1: "Är Donnéeën", step2: "Är Plaz", step3: "Äre Projet", step4: "Bestätegung",
    firstName: "Virnumm", lastName: "Nonumm", email: "Email", phone: "Telefon",
    country: "Land", postalCode: "Postleitzuel", city: "Stad (optional)",
    category: "Aart vun Aarbechten", remarks: "Beschreiwt Äre Projet (optional)",
    consent: "Ech stëmmen zou vu Fachleit kontaktéiert ze ginn (RGPD).",
    next: "Weider", prev: "Zréck", submit: "Meng Ufro schécken",
    success: "Merci! Är Ufro gouf geschéckt. Dir kritt bis zu 5 Offeren bannent 48 Stonnen.",
    error: "Feeler. Probéiert w.e.g. nach eng Kéier.", sending: "Gëtt geschéckt...",
    be: "Belsch", nl: "Holland", lu: "Lëtzebuerg", fr: "Frankräich",
    free: "100% gratis", noObligation: "Ouni Engagement", fast: "Äntwert bannent 48St",
  },
};

const stepIcons = [User, MapPin, Wrench, FileCheck];

export default function MultiStepLeadForm({ locale, preselectedCategory }: MultiStepLeadFormProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    country: "BE", postalCode: "", city: "",
    categoryId: preselectedCategory || "", remarks: "", consent: false,
  });

  const t = labels[locale] || labels.fr;
  const grouped = Object.entries(
    bobexCategories.reduce((acc, cat) => {
      (acc[cat.group] ??= []).push(cat);
      return acc;
    }, {} as Record<string, typeof bobexCategories>)
  ).map(([group, items]) => ({
    group,
    label: bobexGroupLabels[group]?.[locale] || group,
    items,
  }));

  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  function canProceed(): boolean {
    if (step === 1) return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.consent);
    if (step === 2) return !!(formData.country && formData.postalCode);
    if (step === 3) return !!formData.categoryId;
    return true;
  }

  async function handleSubmit() {
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent: "on", locale }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setStep(4);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-eco-green to-energy-blue p-6 text-white">
        <h3 className="text-xl font-bold">{t.title}</h3>
        <div className="mt-2 flex gap-4 text-xs text-white/70">
          <span>{t.free}</span>
          <span>|</span>
          <span>{t.noObligation}</span>
          <span>|</span>
          <span>{t.fast}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-b border-border/30 px-6 py-4">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((s) => {
            const Icon = stepIcons[s - 1];
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  s <= step ? "bg-eco-green text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {s < step ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-[10px] font-medium ${s <= step ? "text-eco-green" : "text-muted-foreground"}`}>
                  {t[`step${s}` as keyof typeof t]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-eco-green to-energy-blue transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Steps */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Contact */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t.firstName} *</label>
                  <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.currentTarget.value)} required placeholder={t.firstName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t.lastName} *</label>
                  <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.currentTarget.value)} required placeholder={t.lastName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t.email} *</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.currentTarget.value)} required placeholder="email@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t.phone} *</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.currentTarget.value)} required placeholder="+32 4XX XX XX XX" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" checked={formData.consent} onChange={(e) => updateField("consent", e.target.checked)} className="mt-1" />
                <span className="text-xs text-muted-foreground">{t.consent}</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.country} *</label>
                <select value={formData.country} onChange={(e) => updateField("country", e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="BE">{t.be}</option>
                  <option value="NL">{t.nl}</option>
                  <option value="LU">{t.lu}</option>
                  <option value="FR">{t.fr}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.postalCode} *</label>
                <Input value={formData.postalCode} onChange={(e) => updateField("postalCode", e.currentTarget.value)} required placeholder="1000" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.city}</label>
                <Input value={formData.city} onChange={(e) => updateField("city", e.currentTarget.value)} placeholder={t.city} />
              </div>
            </motion.div>
          )}

          {/* Step 3: Project */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.category} *</label>
                <select value={formData.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="">— {t.category} —</option>
                  {grouped.map((g) => (
                    <optgroup key={g.group} label={g.label}>
                      {g.items.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label[locale as keyof typeof cat.label] || cat.label.fr}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t.remarks}</label>
                <Textarea value={formData.remarks} onChange={(e) => updateField("remarks", e.currentTarget.value)} rows={4} placeholder={t.remarks} />
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && status === "success" && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eco-green/10">
                <CheckCircle2 className="h-8 w-8 text-eco-green" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {status === "error" && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {t.error}
          </div>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> {t.prev}
              </Button>
            ) : <div />}

            {step < 3 ? (
              <Button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} className="gap-2 bg-gradient-to-r from-eco-green to-energy-blue text-white hover:opacity-90">
                {t.next} <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || status === "loading"} className="gap-2 bg-gradient-to-r from-eco-green to-energy-blue text-white hover:opacity-90">
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {t.sending}</>
                ) : (
                  <><Send className="h-4 w-4" /> {t.submit}</>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
