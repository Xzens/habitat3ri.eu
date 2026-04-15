@AGENTS.md

# Habitat3RI.eu — Project Guide

## Overview

Portal site for the Constellation Satyvo SA — 33+ niche sites focused on sustainable renovation, renewable energy, and Jeremy Rifkin's Third Industrial Revolution (3RI) for BE/NL/LU/FR.

**Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui (Base UI) + Framer Motion + Supabase (pgvector)
**Deployment**: Vercel (prod: habitat3rieu.vercel.app, target domain: habitat3ri.eu)
**Repo**: github.com/Xzens/habitat3ri.eu

## Key Architecture

```
src/
├── app/
│   ├── [locale]/              # 5 locales: fr, nl, en, de, lb
│   │   ├── page.tsx           # One-page home (8 sections)
│   │   ├── blog/[slug]/       # Blog articles (5 sample + 182 scheduled)
│   │   └── deuxieme-cerveau/  # AI Second Brain (search + RAG chat)
│   ├── api/
│   │   ├── chat-rag/          # Streaming RAG chat (XAI Grok)
│   │   ├── search/            # Hybrid vector+text search
│   │   ├── embeddings/        # Article embedding generation
│   │   ├── solteo-webhook/    # Solteo → Bobex lead routing
│   │   ├── cron/publish/      # Auto-publish + auto-embed every 2 days
│   │   ├── contact/           # Devis form (Zod + rate limit)
│   │   └── newsletter/        # Email subscription
│   └── sitemap.ts, robots.ts
├── components/
│   ├── sections/              # Hero, Pillars, Solutions, SolteoCalculator,
│   │                          # BlogPreview, SecondBrainPreview, Partners, Contact
│   ├── brain/                 # SemanticSearch, ChatRAG, SaveArticleButton,
│   │                          # UserNotes, SecondBrainPage
│   └── layout/                # Header (5-lang dropdown), Footer
├── i18n/messages/             # fr.json, nl.json, en.json, de.json, lb.json
├── data/
│   ├── constellation.ts       # 21 satellite sites with descriptions
│   ├── sample-articles.ts     # 5 full articles (3 FR + 2 NL)
│   └── editorial-calendar.json # 182 scheduled articles (110 FR + 72 NL)
├── lib/
│   ├── ai.ts                  # XAI Grok client (embeddings + chat)
│   ├── supabase.ts            # Public client
│   └── supabase-server.ts     # Service role client
└── proxy.ts                   # Locale detection + redirect
```

## Secrets (env vars, NEVER hardcode)

| Var | Purpose |
|-----|---------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key (public) |
| SUPABASE_SERVICE_ROLE_KEY | Admin operations (embeddings, CRON) |
| XAI_API_KEY | XAI/Grok API for embeddings + chat |
| CRON_SECRET | Vercel CRON authorization |
| NEXT_PUBLIC_GA_ID | Google Analytics 4 measurement ID |
| TELEGRAM_BOT_TOKEN | @trouvleClawBot notifications |
| TELEGRAM_CHAT_ID | Telegram chat for lead alerts |

## Solteo Integration

Single companyId `55ac3311-28fe-47dd-8d28-91238edb89b0` for the entire constellation.
Webhook: `/api/solteo-webhook` — routes leads to Bobex by postal code country detection.
Widget: SolteoCalculator component opens `app.solteo.fr/lead-magnet?companyId=...`

## Deuxieme Cerveau (Second Brain)

Development tool for Claude + user-facing feature. Uses:
- Supabase pgvector (3072-dim embeddings via XAI grok-2-embedding-large)
- Hybrid search: vector cosine similarity + PostgreSQL full-text
- RAG chat: retrieves top 8 article chunks, streams response via XAI grok-3-mini
- CRON auto-generates embeddings on article publish

## shadcn/ui v4 (Base UI)

This project uses shadcn v4 which is built on Base UI (NOT Radix).
- Button does NOT support `asChild` — use `buttonVariants()` with `<a>` or `<Link>` instead
- Accordion uses `multiple` prop (not `type="multiple"`)
- AccordionItem uses `value` prop normally

## i18n (5 languages)

Locales: fr (default), nl, en, de, lb (Luxembourgish)
- proxy.ts detects Accept-Language, maps `lu` → `lb`
- All pages use `[locale]` dynamic segment
- Dictionary files in `src/i18n/messages/*.json` — keep structure identical across all 5
- Constellation site descriptions only have fr/nl — components fallback: `description[locale] || description.fr`

## Build & Deploy

```bash
npm run dev          # Local dev server
npm run build        # Production build (must pass before push)
git push origin master  # Auto-deploys via Vercel Git integration
```

## Images

Generated via XAI `grok-imagine-image` API, converted to WebP via sharp.
Script: `scripts/generate-images.mjs` (reads API key from env or E:\Synergy\xai.txt)
All images named `*-xai.webp` in `public/images/hero/` and `public/images/blog/`
