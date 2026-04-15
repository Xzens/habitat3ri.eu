import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { generateEmbedding, chatCompletionStream } from "@/lib/ai";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  locale: z.enum(["fr", "nl"]).default("fr"),
  session_id: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .default([]),
});

const SYSTEM_PROMPT_FR = `Tu es l'assistant IA du "Deuxième Cerveau 3RI" de Habitat3RI.eu — le hub de la rénovation durable et de la Troisième Révolution Industrielle (Jeremy Rifkin) au Benelux et en France.

RÈGLES STRICTES :
- Tu réponds UNIQUEMENT sur la base du contexte fourni (articles du site).
- Si le contexte ne contient pas assez d'information, dis-le honnêtement et oriente vers les articles pertinents.
- Tu cites toujours tes sources (titre de l'article + lien).
- Tu ne mélanges JAMAIS les langues : tu réponds en français.
- Tu es expert en : panneaux solaires, pompes à chaleur, isolation, batteries, smart grid, prosumer, primes/subsides 2026, rénovation énergétique.
- Tu fournis des chiffres concrets (prix, primes, ROI, COP) quand disponibles dans le contexte.
- Ton ton est professionnel, rassurant et informatif.`;

const SYSTEM_PROMPT_NL = `Je bent de AI-assistent van het "Tweede Brein 3IR" van Habitat3RI.eu — het platform voor duurzame renovatie en de Derde Industriële Revolutie (Jeremy Rifkin) in de Benelux en Frankrijk.

STRIKTE REGELS:
- Je antwoordt ALLEEN op basis van de verstrekte context (artikelen van de site).
- Als de context onvoldoende informatie bevat, zeg dit eerlijk en verwijs naar relevante artikelen.
- Je vermeldt altijd je bronnen (artikeltitel + link).
- Je mengt NOOIT talen: je antwoordt in het Nederlands.
- Je bent expert in: zonnepanelen, warmtepompen, isolatie, batterijen, smart grid, prosumer, premies/subsidies 2026, energierenovatie.
- Je geeft concrete cijfers (prijzen, premies, ROI, COP) wanneer beschikbaar in de context.
- Je toon is professioneel, geruststellend en informatief.`;

/**
 * POST /api/chat-rag
 * RAG chat: retrieves relevant context from article embeddings, then streams an AI response.
 * Body: { message, locale, session_id?, history? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, locale, history } = parsed.data;

    // 1. Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(message);

    // 2. Retrieve relevant article chunks
    const supabase = createServiceClient();
    const { data: matches, error: matchErr } = await supabase.rpc(
      "match_articles",
      {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.25,
        match_count: 8,
        filter_locale: locale,
      }
    );

    if (matchErr) throw matchErr;

    // 3. Build context from retrieved chunks
    const sources: { title: string; slug: string; similarity: number }[] = [];
    let context = "";

    if (matches && matches.length > 0) {
      const seen = new Set<string>();
      for (const match of matches) {
        const meta = match.metadata as { title: string; slug: string; locale: string };
        context += `--- Article: "${meta.title}" ---\n${match.chunk_text}\n\n`;

        if (!seen.has(meta.slug)) {
          seen.add(meta.slug);
          sources.push({
            title: meta.title,
            slug: meta.slug,
            similarity: Math.round(match.similarity * 100),
          });
        }
      }
    }

    // 4. Build messages for the LLM
    const systemPrompt = locale === "nl" ? SYSTEM_PROMPT_NL : SYSTEM_PROMPT_FR;
    const contextBlock =
      context.length > 0
        ? `\n\nCONTEXTE (articles du site) :\n${context}`
        : locale === "nl"
          ? "\n\nGeen relevante artikelen gevonden in de database."
          : "\n\nAucun article pertinent trouvé dans la base de données.";

    const messages = [
      { role: "system" as const, content: systemPrompt + contextBlock },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    // 5. Stream the response
    const stream = await chatCompletionStream(messages);

    // Return streaming response with sources in header
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Sources": JSON.stringify(sources),
      },
    });
  } catch (error) {
    console.error("[Chat RAG] Error:", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
