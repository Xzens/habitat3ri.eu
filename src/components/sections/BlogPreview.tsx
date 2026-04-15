"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { Article } from "@/lib/supabase";

type BlogPreviewProps = {
  locale: Locale;
  dict: {
    blog: {
      sectionTag: string;
      title: string;
      subtitle: string;
      readMore: string;
      viewAll: string;
      publishedOn: string;
      readingTime: string;
    };
  };
  articles: Pick<Article, "slug" | "title" | "excerpt" | "cover_image" | "category" | "reading_time" | "published_at">[];
};

export default function BlogPreview({ locale, dict, articles }: BlogPreviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="relative py-24 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-solar-orange/30 bg-solar-orange/5 text-solar-orange">
            {dict.blog.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.blog.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.blog.subtitle}</p>
        </div>

        {/* Articles grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <Link
                href={`/${locale}/blog/${article.slug}`}
                className="block overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-eco-green/30 hover:shadow-lg hover:shadow-eco-green/5"
              >
                {/* Cover image */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-eco-green/20 to-energy-blue/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-foreground/5">3RI</span>
                  </div>
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-eco-green/90 text-white">{article.category}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-eco-green">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.published_at ? new Date(article.published_at).toLocaleDateString(locale === "fr" ? "fr-BE" : "nl-BE") : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.reading_time} {dict.blog.readingTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/blog`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {dict.blog.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
