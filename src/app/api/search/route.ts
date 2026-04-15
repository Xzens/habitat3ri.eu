import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { generateEmbedding } from "@/lib/ai";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(2).max(500),
  locale: z.enum(["fr", "nl"]).optional(),
  limit: z.number().min(1).max(30).default(10),
});

/**
 * POST /api/search
 * Hybrid vector + text search across published articles.
 * Body: { query: string, locale?: "fr"|"nl", limit?: number }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, locale, limit } = parsed.data;

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    const supabase = createServiceClient();

    // Run hybrid search
    const { data, error } = await supabase.rpc("hybrid_search", {
      query_text: query,
      query_embedding: JSON.stringify(queryEmbedding),
      match_count: limit,
      filter_locale: locale || null,
      text_weight: 0.3,
      vector_weight: 0.7,
    });

    if (error) throw error;

    return NextResponse.json({
      results: data || [],
      query,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("[Search] Error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
