"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Brain, ExternalLink, User, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; slug: string; similarity: number }[];
};

type ChatRAGProps = {
  locale: Locale;
  dict: {
    brain: {
      chatPlaceholder: string;
      chatWelcome: string;
      chatThinking: string;
      chatSources: string;
      chatSend: string;
    };
  };
};

export default function ChatRAG({ locale, dict }: ChatRAGProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          locale,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      // Parse sources from header
      const sourcesHeader = res.headers.get("X-Sources");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      // Read streamed response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", sources },
      ]);

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE data lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: fullContent,
                      sources,
                    };
                    return updated;
                  });
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        }
      }

      // Final update with complete content
      if (fullContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullContent,
            sources,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: locale === "fr"
            ? "Désolé, une erreur est survenue. Veuillez réessayer."
            : "Sorry, er is een fout opgetreden. Probeer het opnieuw.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, locale]);

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-eco-green/5 to-energy-blue/5 px-5 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-eco-green to-energy-blue">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold">
            {locale === "fr" ? "Assistant IA 3RI" : "3IR AI-Assistent"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {locale === "fr"
              ? "Répond à partir de notre base de connaissances"
              : "Antwoordt op basis van onze kennisbank"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Brain className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">{dict.brain.chatWelcome}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "user"
                    ? "bg-energy-blue/10"
                    : "bg-gradient-to-br from-eco-green to-energy-blue"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4 text-energy-blue" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-energy-blue/10 text-foreground"
                    : "bg-muted/50"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content || (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {dict.brain.chatThinking}
                    </span>
                  )}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && msg.content && (
                  <div className="mt-3 border-t border-border/30 pt-2">
                    <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {dict.brain.chatSources}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src) => (
                        <Link
                          key={src.slug}
                          href={`/${locale}/blog/${src.slug}`}
                          className="inline-flex items-center gap-1 rounded-md bg-eco-green/10 px-2 py-1 text-xs font-medium text-eco-green transition-colors hover:bg-eco-green/20"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {src.title.length > 40
                            ? src.title.slice(0, 40) + "..."
                            : src.title}
                          <Badge variant="outline" className="ml-1 px-1 py-0 text-[10px]">
                            {src.similarity}%
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={dict.brain.chatPlaceholder}
            disabled={loading}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-eco-green/50 focus:ring-1 focus:ring-eco-green/20 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-eco-green to-energy-blue text-white transition-all hover:opacity-90 disabled:opacity-50"
            aria-label={dict.brain.chatSend}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
