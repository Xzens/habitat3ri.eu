"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calculator, Sun, Zap, ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

type SolteoCalculatorProps = {
  locale: Locale;
  dict: {
    solteo: {
      sectionTag: string;
      title: string;
      subtitle: string;
      cta: string;
      features: string[];
      disclaimer: string;
    };
  };
};

const SOLTEO_COMPANY_ID = "55ac3311-28fe-47dd-8d28-91238edb89b0";

export default function SolteoCalculator({ locale, dict }: SolteoCalculatorProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showWidget, setShowWidget] = useState(false);

  function openSolteo() {
    setShowWidget(true);
    // Scroll to iframe after it appears
    setTimeout(() => {
      document.getElementById("solteo-widget")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  return (
    <section id="calculateur" className="relative py-24 sm:py-32 bg-muted/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: 2-column info + teaser card */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-solar-orange/30 bg-solar-orange/5 text-solar-orange">
              <Calculator className="mr-1.5 h-3.5 w-3.5" />
              {dict.solteo.sectionTag}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {dict.solteo.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {dict.solteo.subtitle}
            </p>

            <ul className="mt-6 space-y-3">
              {dict.solteo.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eco-green/10">
                    <Zap className="h-3 w-3 text-eco-green" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={openSolteo}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 bg-gradient-to-r from-solar-orange to-amber-500 px-8 text-base font-semibold text-white shadow-lg shadow-solar-orange/25 transition-all hover:opacity-90"
              )}
            >
              <Sun className="mr-2 h-5 w-5" />
              {dict.solteo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <p className="mt-3 text-xs text-muted-foreground">
              {dict.solteo.disclaimer}
            </p>
          </motion.div>

          {/* Right: teaser card (always visible, clickable) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div
              onClick={openSolteo}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-solar-orange/10 via-amber-500/5 to-eco-green/10 p-8 transition-all hover:border-solar-orange/30 hover:shadow-xl hover:shadow-solar-orange/10"
            >
              <div className="flex flex-col items-center text-center">
                {/* Visual illustration */}
                <div className="relative mb-6">
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-solar-orange to-amber-500 shadow-xl transition-transform group-hover:scale-110">
                    <Sun className="h-14 w-14 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-eco-green shadow-lg">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold">
                  {locale === "fr" && "Simulez votre installation solaire"}
                  {locale === "nl" && "Simuleer uw zonne-installatie"}
                  {locale === "en" && "Simulate your solar installation"}
                  {locale === "de" && "Simulieren Sie Ihre Solaranlage"}
                  {locale === "lb" && "Simuléiert Är Sonneninstallatioun"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {locale === "fr" && (showWidget ? "Le calculateur est affiché ci-dessous ↓" : "Cliquez pour lancer le calculateur interactif Solteo")}
                  {locale === "nl" && (showWidget ? "De calculator wordt hieronder weergegeven ↓" : "Klik om de interactieve Solteo-calculator te starten")}
                  {locale === "en" && (showWidget ? "The calculator is displayed below ↓" : "Click to launch the interactive Solteo calculator")}
                  {locale === "de" && (showWidget ? "Der Rechner wird unten angezeigt ↓" : "Klicken Sie, um den interaktiven Solteo-Rechner zu starten")}
                  {locale === "lb" && (showWidget ? "De Rechner gëtt ënnendrënner ugewisen ↓" : "Klickt fir de Solteo-Rechner opzemaachen")}
                </p>

                {/* Stats preview */}
                <div className="mt-6 grid w-full grid-cols-3 gap-4">
                  {[
                    { value: "4-10 kWc", label: locale === "fr" ? "Puissance" : locale === "nl" ? "Vermogen" : locale === "de" ? "Leistung" : locale === "lb" ? "Leeschtung" : "Power" },
                    { value: "5-7 ans", label: locale === "fr" ? "ROI" : "ROI" },
                    { value: "30+", label: locale === "fr" ? "Ans de vie" : locale === "nl" ? "Levensduur" : locale === "de" ? "Lebensdauer" : locale === "lb" ? "Liewensdauer" : "Lifespan" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-background/50 p-3">
                      <span className="block text-lg font-bold text-solar-orange">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: full-width iframe when activated */}
        {showWidget && (
          <motion.div
            id="solteo-widget"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 relative overflow-hidden rounded-2xl border-2 border-solar-orange/30 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 bg-card/90 px-5 py-3 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-solar-orange to-amber-500">
                  <Sun className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold">
                  {locale === "fr" && "Calculateur Solaire Solteo"}
                  {locale === "nl" && "Solteo Zonnecalculator"}
                  {locale === "en" && "Solteo Solar Calculator"}
                  {locale === "de" && "Solteo Solarrechner"}
                  {locale === "lb" && "Solteo Sonnerechner"}
                </span>
              </div>
              <button
                onClick={() => setShowWidget(false)}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
                {locale === "fr" ? "Fermer" : locale === "nl" ? "Sluiten" : locale === "de" ? "Schließen" : locale === "lb" ? "Zoumaachen" : "Close"}
              </button>
            </div>
            <iframe
              src={`https://app.solteo.fr/lead-magnet?companyId=${SOLTEO_COMPANY_ID}`}
              title="Solteo Solar Calculator"
              className="h-[900px] w-full border-0 bg-white"
              allow="geolocation"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
