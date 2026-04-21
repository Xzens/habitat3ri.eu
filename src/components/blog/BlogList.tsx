"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/supabase";
import type { Locale } from "@/i18n/config";

type BlogListProps = {
  articles: Article[];
  locale: Locale;
  dict: {
    blog: {
      readMore: string;
      readingTime: string;
      publishedOn: string;
      categories: Record<string, string>;
    };
  };
};

export default function BlogList({ articles, locale, dict }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...new Set(articles.map((a) => a.category))];

  const filtered = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-eco-green to-energy-blue text-white shadow-lg"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {dict.blog.categories[cat as keyof typeof dict.blog.categories] || cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/blog/${article.slug}`}
            className="group block overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-eco-green/30 hover:shadow-lg hover:shadow-eco-green/5"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              {article.cover_image ? (
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-eco-green/20 to-energy-blue/20" />
              )}
              {/* Dark overlay for badge readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 z-10">
                <Badge className="bg-eco-green text-white shadow-lg">{article.category}</Badge>
              </div>
            </div>
            <div className="p-5">
              <h2 className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-eco-green">
                {article.title}
              </h2>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString(
                        locale === "fr" ? "fr-BE" : "nl-BE"
                      )
                    : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.reading_time} {dict.blog.readingTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
