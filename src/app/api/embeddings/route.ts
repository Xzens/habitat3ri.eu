import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { generateEmbeddings, chunkText } from "@/lib/ai";

/**
 * POST /api/embeddings
 * Generate and store embeddings for an article.
 * Called by CRON on publish or manually via admin.
 * Body: { article_id: string }
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { article_id } = await request.json();
    if (!article_id) {
      return NextResponse.json({ error: "article_id required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Fetch the article
    const { data: article, error: fetchErr } = await supabase
      .from("articles")
      .select("id, title, excerpt, content, in_brief, locale, category, slug, tags, seo_keywords")
      .eq("id", article_id)
      .single();

    if (fetchErr || !article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Build full text for embedding
    const fullText = [
      article.title,
      article.in_brief || article.excerpt,
      article.content,
    ]
      .filter(Boolean)
      .join("\n\n");

    // Chunk the text
    const chunks = chunkText(fullText);

    // Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunks);

    // Delete existing embeddings for this article
    await supabase
      .from("article_embeddings")
      .delete()
      .eq("article_id", article_id);

    // Insert new embeddings
    const rows = chunks.map((chunk, i) => ({
      article_id,
      chunk_index: i,
      chunk_text: chunk,
      embedding: JSON.stringify(embeddings[i]),
      metadata: {
        title: article.title,
        slug: article.slug,
        locale: article.locale,
        category: article.category,
        tags: article.tags,
      },
    }));

    const { error: insertErr } = await supabase
      .from("article_embeddings")
      .insert(rows);

    if (insertErr) throw insertErr;

    return NextResponse.json({
      success: true,
      article_id,
      chunks: chunks.length,
      dimensions: embeddings[0]?.length || 0,
    });
  } catch (error) {
    console.error("[Embeddings] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
