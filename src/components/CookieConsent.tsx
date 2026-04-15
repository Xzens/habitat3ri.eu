"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import type { Locale } from "@/i18n/config";

const text: Record<string, { message: string; accept: string; decline: string }> = {
  fr: {
    message: "Ce site utilise des cookies analytiques pour améliorer votre expérience. Aucune donnée personnelle n'est partagée avec des tiers.",
    accept: "Accepter",
    decline: "Refuser",
  },
  nl: {
    message: "Deze site gebruikt analytische cookies om uw ervaring te verbeteren. Geen persoonlijke gegevens worden gedeeld met derden.",
    accept: "Accepteren",
    decline: "Weigeren",
  },
  en: {
    message: "This site uses analytics cookies to improve your experience. No personal data is shared with third parties.",
    accept: "Accept",
    decline: "Decline",
  },
  de: {
    message: "Diese Seite verwendet analytische Cookies zur Verbesserung Ihrer Erfahrung. Keine persönlichen Daten werden an Dritte weitergegeben.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
  lb: {
    message: "Dëse Site benotzt analytesch Cookies fir Är Erfahrung ze verbesseren. Keng perséinlech Donnéeë ginn un Drëtten weidergeleet.",
    accept: "Akzeptéieren",
    decline: "Refuséieren",
  },
};

export default function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = text[locale] || text.fr;

  useEffect(() => {
    const stored = localStorage.getItem("habitat3ri-cookie-consent");
    if (!stored) setVisible(true);
  }, []);

  function handleChoice(accepted: boolean) {
    localStorage.setItem("habitat3ri-cookie-consent", accepted ? "accepted" : "declined");
    setVisible(false);
    if (accepted) window.location.reload(); // Reload to trigger GA4
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-in slide-in-from-bottom rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-solar-orange" />
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-muted-foreground">{t.message}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleChoice(true)}
              className="rounded-lg bg-gradient-to-r from-eco-green to-energy-blue px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t.accept}
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              {t.decline}
            </button>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="rounded-lg p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
