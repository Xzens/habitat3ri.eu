"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
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

  const f = dict.contact.form;

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
                    <p className="text-sm text-muted-foreground">contact@habitat3ri.eu</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-energy-blue/10">
                    <Phone className="h-5 w-5 text-energy-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.phone}</p>
                    <p className="text-sm text-muted-foreground">+32 (0) 4XX XX XX XX</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-solar-orange/10">
                    <MapPin className="h-5 w-5 text-solar-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{locale === "fr" ? "Zone de couverture" : "Dekkingsgebied"}</p>
                    <p className="text-sm text-muted-foreground">BE · NL · LU · FR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="rounded-xl border border-eco-green/20 bg-eco-green/5 p-5">
              <p className="text-sm font-semibold text-eco-green">
                {locale === "fr" ? "Devis 100% gratuit et sans engagement" : "100% gratis en vrijblijvende offerte"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {locale === "fr"
                  ? "Réponse sous 24h par nos experts certifiés."
                  : "Antwoord binnen 24u door onze gecertificeerde experts."}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{f.name}</label>
                  <Input name="name" required placeholder={f.name} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{f.email}</label>
                  <Input name="email" type="email" required placeholder={f.email} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{f.phone}</label>
                  <Input name="phone" type="tel" placeholder="+32 ..." />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{f.country}</label>
                  <select
                    name="country"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {(Object.entries(f.countries) as [string, string][]).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">{f.projectType}</label>
                  <select
                    name="projectType"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {(Object.entries(f.projectTypes) as [string, string][]).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">{f.message}</label>
                  <Textarea name="message" rows={4} placeholder={f.message} />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <input type="checkbox" id="consent" name="consent" required className="mt-1" />
                <label htmlFor="consent" className="text-xs text-muted-foreground">{f.consent}</label>
              </div>

              <div className="mt-6">
                {status === "success" ? (
                  <div className="flex items-center gap-2 rounded-lg bg-eco-green/10 p-3 text-sm text-eco-green">
                    <CheckCircle2 className="h-4 w-4" /> {f.success}
                  </div>
                ) : status === "error" ? (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {f.error}
                  </div>
                ) : null}

                {status !== "success" && (
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gradient-to-r from-eco-green to-energy-blue text-white hover:opacity-90"
                    size="lg"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {locale === "fr" ? "Envoi..." : "Verzenden..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> {f.submit}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
