"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2 } from "lucide-react";

type PartnersProps = {
  dict: {
    partners: {
      sectionTag: string;
      title: string;
      subtitle: string;
    };
  };
  locale: "fr" | "nl";
};

const partnerLogos = [
  { name: "Engie", sector: "energy" },
  { name: "Luminus", sector: "energy" },
  { name: "Daikin", sector: "heatpump" },
  { name: "SunPower", sector: "solar" },
  { name: "Tesla Energy", sector: "battery" },
  { name: "Vaillant", sector: "heatpump" },
  { name: "Recticel", sector: "insulation" },
  { name: "Velux", sector: "renovation" },
];

const certifications = {
  fr: [
    "Installateurs certifiés RGE / QualiPV",
    "Partenaires agréés Région Wallonne & Bruxelles",
    "Réseau vérifié et noté par les clients",
    "Garantie décennale sur tous les travaux",
  ],
  nl: [
    "RGE / QualiPV gecertificeerde installateurs",
    "Erkende partners Vlaams Gewest & Nederland",
    "Geverifieerd en beoordeeld netwerk",
    "Tienjarige garantie op alle werkzaamheden",
  ],
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

        {/* Partner logos grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {partnerLogos.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-eco-green/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Award className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="mt-3 text-sm font-semibold">{partner.name}</span>
              <span className="text-xs text-muted-foreground">{partner.sector}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-eco-green/20 bg-eco-green/5 p-8">
          <h3 className="mb-6 text-center text-lg font-bold">
            {locale === "fr" ? "Nos garanties" : "Onze garanties"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications[locale].map((cert) => (
              <div key={cert} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-eco-green" />
                <span className="text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
