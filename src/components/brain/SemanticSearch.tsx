"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/config";

type SearchResult = {
  article_id: string;
  title: string;
  slug: string;
  locale: string;
  excerpt: string;
  category: string;
  chunk_text: string;
  similarity: number;
  combined_score: number;
};

type SemanticSearchProps = {
  locale: Locale;
  dict: {
    brain: {
      searchPlaceholder: string;
      searching: string;
      noResults: string;
      relevance: string;
    };
  };
};

export default function SemanticSearch({ locale, dict }: SemanticSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim() || query.length < 2) return;

      setLoading(true);
      setSearched(true);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, locale, limit: 10 }),
        });
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query, locale]
  );

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={dict.brain.searchPlaceholder}
            className="h-14 rounded-2xl border-2 border-border/50 bg-card pl-12 pr-4 text-base shadow-lg transition-all focus:border-eco-green/50 focus:shadow-eco-green/10"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-eco-green" />
          )}
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse text-eco-green" />
          <span className="text-sm">{dict.brain.searching}</span>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {dict.brain.noResults}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((result, i) => (
            <Link
              key={`${result.article_id}-${i}`}
              href={`/${result.locale}/blog/${result.slug}`}
              className="group block rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-eco-green/30 hover:shadow-md hover:shadow-eco-green/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge className="bg-eco-green/90 text-white text-xs">
                      {result.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {dict.brain.relevance}: {Math.round(result.combined_score * 100)}%
                    </span>
                  </div>
                  <h3 className="font-semibold leading-snug transition-colors group-hover:text-eco-green">
                    {result.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {result.chunk_text?.slice(0, 200)}...
                  </p>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
