"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, Users, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroProps = {
  dict: {
    hero: {
      badge: string;
      title: string;
      titleHighlight: string;
      subtitle: string;
      cta: string;
      ctaSecondary: string;
      stats: {
        sites: string;
        savings: string;
        partners: string;
        countries: string;
      };
    };
  };
};

const stats = [
  { value: "30+", icon: Building2 },
  { value: "40%", icon: Sparkles },
  { value: "200+", icon: Users },
  { value: "4", icon: MapPin },
] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function Hero({ dict }: HeroProps) {
  const statLabels = [
    dict.hero.stats.sites,
    dict.hero.stats.savings,
    dict.hero.stats.partners,
    dict.hero.stats.countries,
  ];

  return (
    <section id="accueil" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-eco-green/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-energy-blue/10 blur-[120px]" />
        <div className="absolute right-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-solar-orange/8 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-eco-green/20 bg-eco-green/10 px-4 py-1.5"
          >
            <Sparkles className="h-4 w-4 text-eco-green" />
            <span className="text-sm font-medium text-eco-green">{dict.hero.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {dict.hero.title}{" "}
            <span className="gradient-text">{dict.hero.titleHighlight}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {dict.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-eco-green to-energy-blue px-8 text-base font-semibold text-white shadow-lg shadow-eco-green/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-eco-green/30"
              )}
            >
              {dict.hero.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#piliers"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 text-base")}
            >
              {dict.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div key={stat.value} className="group flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-eco-green/10 to-energy-blue/10 transition-transform group-hover:scale-110">
                  <stat.icon className="h-5 w-5 text-eco-green" />
                </div>
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{statLabels[i]}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
