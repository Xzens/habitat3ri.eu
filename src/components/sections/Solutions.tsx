"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Paintbrush, Zap, Shield, Cpu, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { constellation, type ConstellationSite } from "@/data/constellation";
import type { Locale } from "@/i18n/config";

type SolutionsProps = {
  locale: Locale;
  dict: {
    solutions: {
      sectionTag: string;
      title: string;
      subtitle: string;
      categories: {
        renovation: string;
        energy: string;
        security: string;
        digital: string;
        services: string;
      };
      cta: string;
    };
  };
};

const categoryIcons = {
  renovation: Paintbrush,
  energy: Zap,
  security: Shield,
  digital: Cpu,
  services: Wrench,
};

const categoryColors = {
  renovation: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  energy: "text-eco-green bg-eco-green/10 border-eco-green/20",
  security: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  digital: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  services: "text-teal-500 bg-teal-500/10 border-teal-500/20",
};

type Category = ConstellationSite["category"];

export default function Solutions({ locale, dict }: SolutionsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const categories = Object.keys(dict.solutions.categories) as Category[];

  const filteredSites = constellation.filter((site) => {
    const langMatch = site.lang === locale || site.lang === "multi";
    const catMatch = activeCategory === "all" || site.category === activeCategory;
    return langMatch && catMatch;
  });

  return (
    <section id="solutions" className="relative py-24 sm:py-32 bg-muted/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-energy-blue/30 bg-energy-blue/5 text-energy-blue">
            {dict.solutions.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.solutions.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.solutions.subtitle}</p>
        </div>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-eco-green to-energy-blue text-white shadow-lg"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {locale === "fr" ? "Tous" : "Alle"}
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-eco-green to-energy-blue text-white shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {dict.solutions.categories[cat]}
              </button>
            );
          })}
        </div>

        {/* Sites grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSites.map((site, i) => {
            const Icon = categoryIcons[site.category];
            const colors = categoryColors[site.category];
            return (
              <motion.a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-eco-green/30 hover:shadow-lg hover:shadow-eco-green/5"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colors}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="mt-3 font-semibold">{site.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {site.description[locale] || site.description.fr || site.description.nl}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {site.country.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {c.toUpperCase()}
                    </span>
                  ))}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
