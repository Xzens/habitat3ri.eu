"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MultiStepLeadForm from "@/components/MultiStepLeadForm";
import type { Locale } from "@/i18n/config";

type ContactProps = {
  locale: Locale;
  dict: {
    contact: {
      sectionTag: string;
      title: string;
      subtitle: string;
      form: {
        name: string;
        email: string;
        phone: string;
        country: string;
        countries: { be: string; nl: string; lu: string; fr: string };
        projectType: string;
        projectTypes: {
          solar: string;
          insulation: string;
          renovation: string;
          smartHome: string;
          bundle: string;
          other: string;
        };
        message: string;
        consent: string;
        submit: string;
        success: string;
        error: string;
      };
    };
  };
};

export default function Contact({ locale, dict }: ContactProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 sm:py-32" ref={ref}>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-eco-green/3 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-eco-green/30 bg-eco-green/5 text-eco-green">
            {dict.contact.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.contact.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.contact.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-2"
          >
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-eco-green/10">
                    <Mail className="h-5 w-5 text-eco-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <a href="mailto:info@satyvo.be" className="text-sm text-muted-foreground hover:text-eco-green transition-colors">info@satyvo.be</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-energy-blue/10">
                    <Phone className="h-5 w-5 text-energy-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{dict.contact.form.phone}</p>
                    <a href="tel:+32456405810" className="text-sm text-muted-foreground hover:text-energy-blue transition-colors">+32 456 40 58 10</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-solar-orange/10">
                    <MapPin className="h-5 w-5 text-solar-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{{ fr: "Zone de couverture", nl: "Dekkingsgebied", en: "Coverage area", de: "Abdeckungsgebiet", lb: "Ofdeckungsgebitt" }[locale]}</p>
                    <p className="text-sm text-muted-foreground">BE · NL · LU · FR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="rounded-xl border border-eco-green/20 bg-eco-green/5 p-5">
              <p className="text-sm font-semibold text-eco-green">
                {{ fr: "Devis 100% gratuit et sans engagement", nl: "100% gratis en vrijblijvende offerte", en: "100% free quote, no obligation", de: "100% kostenlos und unverbindlich", lb: "100% gratis an ouni Engagement" }[locale]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {{ fr: "Réponse sous 24h par nos experts certifiés.", nl: "Antwoord binnen 24u door onze gecertificeerde experts.", en: "Response within 24h from our certified experts.", de: "Antwort innerhalb von 24 Stunden durch unsere zertifizierten Experten.", lb: "Äntwert bannent 24St vun eise zertifizéierte Experten." }[locale]}
              </p>
            </div>

            {/* Company info */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Satyvo SA</strong> — BCE 0791.828.816
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {{ fr: "Société anonyme de droit belge", nl: "Naamloze vennootschap naar Belgisch recht", en: "Belgian limited company (SA)", de: "Belgische Aktiengesellschaft", lb: "Belsch Aktiounsgesellschaft" }[locale]}
              </p>
            </div>
          </motion.div>

          {/* Bobex Lead Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <MultiStepLeadForm locale={locale} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
