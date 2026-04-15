"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Brain, Search, MessageSquare, Bookmark, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

type SecondBrainPreviewProps = {
  locale: Locale;
  dict: {
    brain: {
      sectionTag: string;
      title: string;
      subtitle: string;
      features: {
        search: { title: string; desc: string };
        chat: { title: string; desc: string };
        save: { title: string; desc: string };
        recommend: { title: string; desc: string };
      };
      cta: string;
    };
  };
};

const features = [
  { key: "search" as const, icon: Search, gradient: "from-eco-green to-emerald-500" },
  { key: "chat" as const, icon: MessageSquare, gradient: "from-energy-blue to-indigo-500" },
  { key: "save" as const, icon: Bookmark, gradient: "from-solar-orange to-amber-500" },
  { key: "recommend" as const, icon: Sparkles, gradient: "from-purple-400 to-pink-500" },
];

export default function SecondBrainPreview({ locale, dict }: SecondBrainPreviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cerveau" className="relative py-24 sm:py-32" ref={ref}>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-eco-green/5 via-energy-blue/5 to-purple-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-purple-400/30 bg-purple-400/5 text-purple-500">
            {dict.brain.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.brain.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.brain.subtitle}</p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, i) => {
            const fDict = dict.brain.features[feat.key];
            return (
              <motion.div
                key={feat.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 text-center transition-all hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.gradient} shadow-lg transition-transform group-hover:scale-110`}
                >
                  <feat.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 font-bold">{fDict.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {fDict.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href={`/${locale}/deuxieme-cerveau`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gradient-to-r from-eco-green via-energy-blue to-purple-500 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-90"
            )}
          >
            <Brain className="mr-2 h-5 w-5" />
            {dict.brain.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
