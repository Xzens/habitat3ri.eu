import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { chatCompletion } from "@/lib/ai";
import { getAuthorBySlug, getAuthorForCategory } from "@/data/authors";
import calendar from "@/data/editorial-calendar.json";

/**
 * CRON Job: Publie automatiquement le/les article(s) planifie(s) pour aujourd'hui.
 * Runs every 48h at 06:00 UTC (vercel.json: "0 6 *\/2 * *").
 *
 * Flow:
 * 1. Trouve les entries du calendar avec scheduled_date <= today AND status = "scheduled"
 * 2. Pour chacune : genere le contenu complet via xAI Grok (structure WiseWand)
 * 3. Insere dans Supabase table `articles` via service role
 * 4. Met a jour l'entry du calendar (status = "published")
 * 5. Retourne le resume
 *
 * Note: Le script Python scripts/publish_daily.py fait la meme chose avec plus
 * d'options (images, retry, dry-run). Cette route est l'equivalent serverless Vercel.
 */

type CalendarEntry = {
  id: number;
  scheduled_date: string;
  locale: string;
  title: string;
  category: string;
  seo_keywords: string[];
  status: string;
  slug?: string;
  author_slug?: string;
  image?: string;
  image_prompt?: string;
  published_at?: string;
};

const SYSTEM_PROMPTS: Record<string, string> = {
  fr: `Tu es un rédacteur senior SEO pour Habitat3RI.eu (portail rénovation durable Benelux + France).
Tu écris des articles factuels, chiffrés, pragmatiques, ton professionnel mais accessible.
Pattern WiseWand obligatoire : structure enrichie (En bref, Sommaire, Tableau, Citations, Contenu, FAQ, Sources).
Tu NE MÉLANGES JAMAIS les langues (article FR = liens internes FR uniquement).
Tu ne mentionnes JAMAIS les concurrents (Bobex, Solvari, ImmoValue) dans le contenu.
Sources externes obligatoires : sites gouvernementaux (energie.wallonie.be, environnement.brussels, rvo.nl, ademe.fr) ou institutionnels (IEA, EHPA, Commission Européenne, Rifkin Foundation).
Retour JSON uniquement entre triple backticks json, sans explication.`,
  nl: `Je bent een senior SEO-copywriter voor Habitat3RI.eu (Benelux portaal duurzame renovatie).
Je schrijft feitelijke, cijfermatige, pragmatische artikelen in professionele maar toegankelijke toon.
WiseWand patroon verplicht: verrijkte structuur (Kort, Inhoud, Tabel, Citaten, Inhoud, FAQ, Bronnen).
Meng NOOIT talen (NL artikel = alleen NL interne links).
Vermeld NOOIT concurrenten (Bobex, Solvari) in de inhoud.
Verplichte externe bronnen: overheidssites (rvo.nl, milieucentraal.nl, vlaanderen.be) of instituten (IEA, EHPA).
Alleen JSON tussen triple backticks json, zonder uitleg.`,
};

function buildUserPrompt(entry: CalendarEntry, authorName: string): string {
  const lang = entry.locale;
  const targetLang = lang === "fr" ? "français belge (FR-BE)" : "nederlands (NL-BE + NL)";
  const country = lang === "fr" ? "Belgique + Wallonie/Bruxelles/Luxembourg/France" : "Nederland + Vlaanderen";

  return `Rédige un article complet sur : "${entry.title}"

Paramètres :
- Langue : ${targetLang}
- Catégorie : ${entry.category}
- Marché cible : ${country}
- Slug : ${entry.slug}
- Mots-clés SEO : ${entry.seo_keywords.join(", ")}
- Auteur : ${authorName}
- Longueur cible : 1800-2200 mots

Retour JSON obligatoire :
{
  "title": "titre 50-60 chars avec 2026 + chiffre clé",
  "excerpt": "meta 150-160 chars",
  "in_brief": "encart En Bref, 250-350 chars, zero HTML",
  "content": "HTML riche: h2 avec id, h3, p, strong, ul/ol, table, blockquote. 1800+ mots.",
  "key_info": [{"label": "...", "value": "..."}] (6-8 rows chiffrées),
  "quotes": ["citation 1 avec auteur", "citation 2", "citation 3"],
  "faq": [{"question": "...", "answer": "..."}] (5-6 paires),
  "external_sources": [{"title": "...", "url": "https://...", "author": "..."}] (2-4 sources officielles),
  "internal_links": [{"title": "...", "url": "https://..."}] (3-5 liens constellation même langue),
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "reading_time": 7
}

INTERDICTIONS : pas de concurrents (Bobex, Solvari...), pas de mélange langues, pas d'URL inventée.
Réponse : JSON seul entre triple backticks json.`;
}

function parseArticleJson(raw: string): Record<string, unknown> | null {
  const match = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || raw.match(/(\{[\s\S]*\})/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!xaiKey || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing XAI_API_KEY or SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    const calendarTyped = calendar as CalendarEntry[];
    const candidates = calendarTyped.filter(
      (e) => e.status === "scheduled" && e.scheduled_date <= today
    );

    if (candidates.length === 0) {
      return NextResponse.json({ message: "No articles to publish", timestamp: now.toISOString() });
    }

    // Publish max 1 article per CRON run (48h rhythm)
    const entry = candidates[0];
    const authorSlug = entry.author_slug || "sophie-claessens";
    const author = getAuthorBySlug(authorSlug) || getAuthorForCategory(entry.category);

    // 1. Generate content via xAI
    const systemPrompt = SYSTEM_PROMPTS[entry.locale] || SYSTEM_PROMPTS.fr;
    const userPrompt = buildUserPrompt(entry, author.name);
    const rawResponse = await chatCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const articleData = parseArticleJson(rawResponse);
    if (!articleData) {
      throw new Error("Failed to parse article JSON from xAI response");
    }

    // 2. Insert into Supabase
    const supabase = createServiceClient();
    const row = {
      slug: entry.slug,
      locale: entry.locale,
      title: articleData.title || entry.title,
      excerpt: String(articleData.excerpt || "").slice(0, 300),
      cover_image: entry.image || "",
      content: articleData.content || "",
      in_brief: articleData.in_brief || "",
      key_info: articleData.key_info || [],
      quotes: articleData.quotes || [],
      faq: articleData.faq || [],
      internal_links: articleData.internal_links || [],
      external_sources: articleData.external_sources || [],
      youtube_url: articleData.youtube_url || null,
      category: entry.category,
      tags: articleData.tags || [],
      seo_keywords: entry.seo_keywords,
      reading_time: articleData.reading_time || 7,
      author_slug: authorSlug,
      status: "published",
      published_at: now.toISOString(),
      scheduled_at: `${entry.scheduled_date}T06:00:00Z`,
    };

    const { error } = await supabase
      .from("articles")
      .upsert(row, { onConflict: "slug,locale" });

    if (error) throw new Error(`Supabase insert failed: ${error.message}`);

    // 3. Notify Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChat = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChat) {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: `<b>Habitat3RI publie</b>\nLang: ${entry.locale.toUpperCase()}\nTitle: ${row.title}\nCategory: ${entry.category}\nURL: https://habitat3ri.eu/${entry.locale}/blog/${entry.slug}`,
          parse_mode: "HTML",
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      published: {
        slug: entry.slug,
        locale: entry.locale,
        title: row.title,
        category: entry.category,
        words: String(row.content).split(/\s+/).length,
      },
      remaining: candidates.length - 1,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[CRON] Error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
