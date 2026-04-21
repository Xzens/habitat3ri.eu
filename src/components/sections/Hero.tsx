"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
    <section
      id="accueil"
      className="relative flex min-h-[92vh] items-center overflow-hidden pt-16"
    >
      {/* Full-width hero background image with dark gradient veil */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero/hero-banner-3ri-2026-xai.webp"
          alt="Quartier eco-durable 3RI au Benelux — panneaux solaires, pompes a chaleur, mobilite electrique"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Dark gradient veil for text readability (stronger on left where text is) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(10, 46, 26, 0.88) 0%, rgba(12, 25, 41, 0.75) 40%, rgba(26, 10, 46, 0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Accent glow spots */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-eco-green/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-energy-blue/15 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-eco-green/40 bg-eco-green/15 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-eco-green-light" />
            <span className="text-sm font-medium text-white">
              {dict.hero.badge}
            </span>
          </motion.div>

          {/* Title — white on dark background */}
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
          >
            {dict.hero.title}{" "}
            <span
              className="inline-block bg-gradient-to-r from-eco-green-light via-energy-blue-light to-solar-gold bg-clip-text text-transparent"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              {dict.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
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
                "bg-gradient-to-r from-eco-green to-energy-blue px-8 text-base font-semibold text-white shadow-2xl shadow-eco-green/40 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-eco-green/60"
              )}
            >
              {dict.hero.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#piliers"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20"
              )}
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
            className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:mt-20"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.value}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-eco-green/30 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-eco-green/30 to-energy-blue/30 transition-transform group-hover:scale-110">
                  <stat.icon className="h-5 w-5 text-eco-green-light" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-sm text-white/80">{statLabels[i]}</span>
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
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
