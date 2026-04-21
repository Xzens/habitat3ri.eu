"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Share2, ArrowLeft, ExternalLink, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Article } from "@/lib/supabase";
import type { Locale } from "@/i18n/config";
import { getAuthorForCategory, getAuthorBySlug } from "@/data/authors";
import AuthorCard from "./AuthorCard";

type ArticlePageProps = {
  article: Article;
  locale: Locale;
  dict: {
    blog: {
      publishedOn: string;
      readingTime: string;
      inBrief: string;
      tableOfContents: string;
      keyInfo: string;
      faq: string;
      relatedArticles: string;
      sources: string;
      share: string;
      readMore: string;
    };
  };
  relatedArticles: Article[];
};

function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[2];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    headings.push({ level: match[1].length, text, id });
  }
  return headings;
}

function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      elements.push(<h3 key={i} id={id} className="text-xl font-bold mt-8 mb-3 text-energy-blue scroll-mt-24">{text}</h3>);
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      elements.push(<h2 key={i} id={id} className="text-2xl font-bold mt-10 mb-4 text-eco-green scroll-mt-24">{text}</h2>);
    } else if (line.startsWith("- ")) {
      elements.push(<li key={i} className="ml-4 mb-1 list-disc">{formatBold(line.slice(2))}</li>);
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<li key={i} className="ml-4 mb-1 list-decimal">{formatBold(line.replace(/^\d+\.\s/, ""))}</li>);
    } else if (line.startsWith("|")) {
      continue;
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} className="mb-3 leading-relaxed">{formatBold(line)}</p>);
    }
  }

  return <>{elements}</>;
}

function formatBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export default function ArticlePage({ article, locale, dict, relatedArticles }: ArticlePageProps) {
  const headings = extractHeadings(article.content);

  // Resolve author (by slug if set, otherwise by category)
  const author = article.author_slug
    ? getAuthorBySlug(article.author_slug) || getAuthorForCategory(article.category)
    : getAuthorForCategory(article.category);

  const langMap: Record<string, string> = {
    fr: "fr-BE",
    nl: "nl-BE",
    en: "en-GB",
    de: "de-DE",
    lb: "lb-LU",
  };
  const inLanguage = langMap[locale] || "fr-BE";
  const articleUrl = `https://habitat3ri.eu/${locale}/blog/${article.slug}`;
  const blogUrl = `https://habitat3ri.eu/${locale}/blog`;
  const homeUrl = `https://habitat3ri.eu/${locale}`;
  const coverImageUrl = article.cover_image
    ? `https://habitat3ri.eu${article.cover_image}`
    : `https://habitat3ri.eu/images/hero/hero-banner-3ri-2026-xai.webp`;
  const youtubeId = article.youtube_url?.match(/embed\/([a-zA-Z0-9_-]{11})/)?.[1];

  // Build rich Schema.org JSON-LD graph
  const schemaGraph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": articleUrl + "#article",
      headline: article.title,
      description: article.excerpt,
      image: coverImageUrl,
      datePublished: article.published_at,
      dateModified: article.updated_at,
      author: {
        "@type": "Person",
        name: author.name,
        description: author.role[locale] || author.role.fr,
        jobTitle: author.role[locale] || author.role.fr,
        knowsAbout: author.expertise,
        address: { "@type": "PostalAddress", addressLocality: author.location, addressCountry: "BE" },
        ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
      },
      publisher: {
        "@type": "Organization",
        name: "Habitat 3RI",
        url: "https://habitat3ri.eu",
        logo: {
          "@type": "ImageObject",
          url: "https://habitat3ri.eu/images/hero/hero-banner-3ri-2026-xai.webp",
        },
      },
      mainEntityOfPage: articleUrl,
      inLanguage,
      keywords: (article.seo_keywords || []).join(", "),
      articleSection: article.category,
      wordCount: article.content.split(/\s+/).length,
    },
    {
      "@type": "BreadcrumbList",
      "@id": articleUrl + "#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    },
  ];

  // FAQPage schema if FAQ present
  if (article.faq && article.faq.length > 0) {
    schemaGraph.push({
      "@type": "FAQPage",
      "@id": articleUrl + "#faq",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  // VideoObject schema if YouTube video present
  if (youtubeId) {
    schemaGraph.push({
      "@type": "VideoObject",
      "@id": articleUrl + "#video",
      name: article.title,
      description: article.excerpt,
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      uploadDate: article.published_at,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    });
  }

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemaGraph,
  });

  return (
    <>
      {/* Full-width cover image with overlay header — visible desktop + mobile */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden sm:h-[60vh]">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-eco-green/20 via-energy-blue/10 to-solar-orange/10">
            <span className="text-6xl font-black text-foreground/5">HABITAT 3RI</span>
          </div>
        )}
        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-6 sm:pb-12">
          <div className="mx-auto max-w-4xl">
            <Link
              href={`/${locale}/blog`}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 transition-colors hover:text-white sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "fr" && "Retour au blog"}
              {locale === "nl" && "Terug naar blog"}
              {locale === "en" && "Back to blog"}
              {locale === "de" && "Zurück zum Blog"}
              {locale === "lb" && "Zréck op de Blog"}
            </Link>
            <Badge className="mb-3 bg-eco-green text-white">{article.category}</Badge>
            <h1
              className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/90 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString(
                      locale === "fr" ? "fr-BE" : locale === "nl" ? "nl-BE" : locale === "de" ? "de-DE" : locale === "lb" ? "fr-LU" : "en-GB",
                      { year: "numeric", month: "long", day: "numeric" }
                    )
                  : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.reading_time} {dict.blog.readingTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-24 pt-12 sm:px-6">

      {/* In Brief */}
      <div className="mb-8 rounded-xl border-l-4 border-eco-green bg-eco-green/5 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-eco-green">
          {dict.blog.inBrief}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{article.in_brief}</p>
      </div>

      {/* Table of Contents */}
      {headings.length > 0 && (
        <nav className="mb-8 rounded-xl border border-border/50 bg-card p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider">{dict.blog.tableOfContents}</h2>
          <ul className="space-y-1.5">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                <a
                  href={`#${h.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-eco-green"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Key Info Table */}
      <div className="mb-8 overflow-hidden rounded-xl border border-border/50">
        <div className="bg-energy-blue/10 px-5 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-energy-blue">{dict.blog.keyInfo}</h2>
        </div>
        <div className="divide-y divide-border/50">
          {article.key_info.map((info) => (
            <div key={info.label} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-muted-foreground">{info.label}</span>
              <span className="text-sm font-semibold">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quotes */}
      {article.quotes.length > 0 && (
        <div className="mb-8 space-y-3">
          {article.quotes.map((quote, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-muted/50 p-4">
              <Quote className="mt-0.5 h-5 w-5 shrink-0 text-solar-orange" />
              <p className="text-sm italic leading-relaxed">{quote}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="prose-3ri mb-12">
        <ContentRenderer content={article.content} />
      </div>

      {/* YouTube Embed */}
      {article.youtube_url && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <iframe
            src={article.youtube_url}
            title={article.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Author card */}
      <AuthorCard author={author} locale={locale} />

      {/* FAQ */}
      {article.faq.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">{dict.blog.faq}</h2>
          <Accordion multiple defaultValue={[]} className="rounded-xl border border-border/50">
            {article.faq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="px-5 text-left text-sm font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Internal Links */}
      {article.internal_links.length > 0 && (
        <div className="mb-8 rounded-xl border border-eco-green/20 bg-eco-green/5 p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-eco-green">
            {locale === "fr" ? "Découvrez aussi" : "Ontdek ook"}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {article.internal_links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-background"
              >
                <ExternalLink className="h-3.5 w-3.5 text-eco-green" />
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* External Sources */}
      {article.external_sources.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider">{dict.blog.sources}</h3>
          <ul className="space-y-2">
            {article.external_sources.map((source) => (
              <li key={source.url} className="text-sm text-muted-foreground">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-energy-blue hover:underline"
                >
                  {source.title}
                </a>{" "}
                — {source.author}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share */}
      <div className="mb-12 flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          {dict.blog.share}
        </Button>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">{dict.blog.relatedArticles}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/${locale}/blog/${a.slug}`}
                className="group rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-eco-green/30 hover:shadow-md"
              >
                <Badge className="mb-2 bg-eco-green/90 text-white text-xs">{a.category}</Badge>
                <h3 className="font-semibold leading-snug transition-colors group-hover:text-eco-green">
                  {a.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Schema.org structured data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {structuredData}
      </script>
      </article>
    </>
  );
}
