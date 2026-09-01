"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sun, BatteryCharging, Thermometer, Home, Cpu, Plug } from "lucide-react";
import type { Locale } from "@/i18n/config";

/**
 * Section "Comment ça marche".
 *
 * Ne nomme aucune marque tierce et n'annonce aucun label de certification : afficher une marque
 * comme partenaire sans accord, ou revendiquer un agrément public inexistant, relève des pratiques
 * commerciales réputées déloyales en toutes circonstances (CDE art. VI.100, 2° et 4°).
 * Les labels RGE et QualiPV sont par ailleurs des dispositifs français, sans équivalence en BE/NL/LU
 * (l'équivalent belge est RESCert PV, dit Qualiwall en Wallonie et SER à Bruxelles).
 *
 * Ne laisser ici que des affirmations vérifiables sur ce que le site fait réellement.
 */

type PartnersProps = {
  dict: {
    partners: {
      sectionTag: string;
      title: string;
      subtitle: string;
    };
  };
  locale: Locale;
};

const domains: { icon: typeof Sun; label: Record<Locale, string> }[] = [
  { icon: Sun, label: { fr: "Panneaux solaires", nl: "Zonnepanelen", en: "Solar panels", de: "Solaranlagen", lb: "Sonnepanneauen" } },
  { icon: BatteryCharging, label: { fr: "Batterie domestique", nl: "Thuisbatterij", en: "Home battery", de: "Hausbatterie", lb: "Hausbatterie" } },
  { icon: Thermometer, label: { fr: "Pompe à chaleur", nl: "Warmtepomp", en: "Heat pump", de: "Wärmepumpe", lb: "Wärmepompel" } },
  { icon: Home, label: { fr: "Isolation", nl: "Isolatie", en: "Insulation", de: "Dämmung", lb: "Isolatioun" } },
  { icon: Cpu, label: { fr: "Domotique & pilotage", nl: "Domotica & sturing", en: "Smart home & control", de: "Hausautomation", lb: "Hausautomatioun" } },
  { icon: Plug, label: { fr: "Borne de recharge", nl: "Laadpaal", en: "EV charger", de: "Ladestation", lb: "Luetstatioun" } },
];

/** Faits vérifiables uniquement : gratuité, absence d'engagement, consentement, éditeur identifié. */
const commitments: Record<Locale, string[]> = {
  fr: [
    "Demande de devis gratuite et sans engagement",
    "Vos données ne sont transmises qu'après votre consentement explicite",
    "Vous comparez librement et restez libre de refuser",
    "Service édité par Satyvo SA (BCE 0791.828.816), Malmedy",
  ],
  nl: [
    "Offerteaanvraag gratis en vrijblijvend",
    "Uw gegevens worden pas doorgegeven na uw uitdrukkelijke toestemming",
    "U vergelijkt vrij en mag altijd weigeren",
    "Dienst uitgegeven door Satyvo SA (KBO 0791.828.816), Malmedy",
  ],
  en: [
    "Free quote request, no obligation",
    "Your data is only shared after your explicit consent",
    "You compare freely and remain free to decline",
    "Service published by Satyvo SA (CBE 0791.828.816), Malmedy, Belgium",
  ],
  de: [
    "Kostenlose und unverbindliche Angebotsanfrage",
    "Ihre Daten werden erst nach Ihrer ausdrücklichen Einwilligung weitergegeben",
    "Sie vergleichen frei und können jederzeit ablehnen",
    "Herausgegeben von Satyvo SA (ZDU 0791.828.816), Malmedy, Belgien",
  ],
  lb: [
    "Gratis Offertufro, ouni Engagement",
    "Är Donnéeë ginn eréischt no Ärer ausdrécklecher Zoustëmmung weiderginn",
    "Dir vergläicht fräi a kënnt ëmmer ofleenen",
    "Service erausginn vu Satyvo SA (BCE 0791.828.816), Malmedy, Belsch",
  ],
};

const headings: Record<Locale, string> = {
  fr: "Notre engagement",
  nl: "Ons engagement",
  en: "Our commitment",
  de: "Unser Versprechen",
  lb: "Eist Engagement",
};

export default function Partners({ dict, locale }: PartnersProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="partenaires" className="relative py-24 sm:py-32 bg-muted/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-solar-gold/30 bg-solar-gold/5 text-solar-orange">
            {dict.partners.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.partners.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.partners.subtitle}</p>
        </div>

        {/* Domaines couverts par le formulaire de demande de devis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.label.fr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:border-eco-green/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-eco-green/10">
                  <Icon className="h-6 w-6 text-eco-green" aria-hidden="true" />
                </div>
                <span className="mt-3 text-sm font-semibold">{domain.label[locale]}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Engagements vérifiables */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-eco-green/20 bg-eco-green/5 p-8">
          <h3 className="mb-6 text-center text-lg font-bold">{headings[locale]}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {commitments[locale].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-eco-green" aria-hidden="true" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
