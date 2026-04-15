"use client";

import { useState } from "react";
import { Brain, Search, MessageSquare, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SemanticSearch from "./SemanticSearch";
import ChatRAG from "./ChatRAG";
import type { Locale } from "@/i18n/config";

type Tab = "search" | "chat" | "space";

type SecondBrainPageProps = {
  locale: Locale;
  dict: {
    brain: {
      pageTitle: string;
      pageDescription: string;
      tabs: {
        search: string;
        chat: string;
        space: string;
      };
      searchPlaceholder: string;
      searching: string;
      noResults: string;
      relevance: string;
      chatPlaceholder: string;
      chatWelcome: string;
      chatThinking: string;
      chatSources: string;
      chatSend: string;
      spaceLogin: string;
      spaceLoginDesc: string;
    };
  };
};

const tabConfig = [
  { key: "search" as Tab, icon: Search },
  { key: "chat" as Tab, icon: MessageSquare },
  { key: "space" as Tab, icon: User },
];

export default function SecondBrainPage({ locale, dict }: SecondBrainPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("search");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <Badge variant="outline" className="mb-4 border-purple-400/30 bg-purple-400/5 text-purple-500">
          <Brain className="mr-1.5 h-3.5 w-3.5" />
          {locale === "fr" ? "Intelligence Artificielle" : "Kunstmatige Intelligentie"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {dict.brain.pageTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {dict.brain.pageDescription}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-eco-green via-energy-blue to-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {dict.brain.tabs[tab.key]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "search" && (
        <div>
          <SemanticSearch locale={locale} dict={dict} />
        </div>
      )}

      {activeTab === "chat" && (
        <div>
          <ChatRAG locale={locale} dict={dict} />
        </div>
      )}

      {activeTab === "space" && (
        <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-solar-orange/20 to-purple-500/20">
            <Sparkles className="h-8 w-8 text-solar-orange" />
          </div>
          <h3 className="mb-2 text-xl font-bold">{dict.brain.spaceLogin}</h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {dict.brain.spaceLoginDesc}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              {locale === "fr" ? "Articles sauvegardés" : "Opgeslagen artikelen"}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              {locale === "fr" ? "Notes personnelles" : "Persoonlijke notities"}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              {locale === "fr" ? "Recommandations IA" : "AI-aanbevelingen"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
