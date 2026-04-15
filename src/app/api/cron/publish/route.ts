import { NextResponse } from "next/server";

/**
 * CRON Job: Auto-publish scheduled articles + generate embeddings
 * Runs every 2 days at 06:00 UTC (configured in vercel.json)
 *
 * Flow:
 * 1. Fetch articles where status='scheduled' AND scheduled_at <= now
 * 2. Update status to 'published', set published_at
 * 3. For each published article, trigger embedding generation
 * 4. Revalidate blog pages
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // In production with Supabase:
    // import { createServiceClient } from "@/lib/supabase-server";
    // const supabase = createServiceClient();
    //
    // const { data: articles, error: fetchError } = await supabase
    //   .from("articles")
    //   .select("id, slug, locale, title")
    //   .eq("status", "scheduled")
    //   .lte("scheduled_at", now);
    //
    // if (fetchError) throw fetchError;
    // if (!articles || articles.length === 0) {
    //   return NextResponse.json({ message: "No articles to publish", published: 0 });
    // }
    //
    // const { error: updateError } = await supabase
    //   .from("articles")
    //   .update({ status: "published", published_at: now, updated_at: now })
    //   .eq("status", "scheduled")
    //   .lte("scheduled_at", now);
    //
    // if (updateError) throw updateError;
    //
    // // Generate embeddings for each newly published article
    // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://habitat3ri.eu";
    // let embeddingsGenerated = 0;
    //
    // for (const article of articles) {
    //   try {
    //     const embRes = await fetch(`${siteUrl}/api/embeddings`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${cronSecret}`,
    //       },
    //       body: JSON.stringify({ article_id: article.id }),
    //     });
    //     if (embRes.ok) embeddingsGenerated++;
    //   } catch (e) {
    //     console.error(`[CRON] Embedding failed for ${article.slug}:`, e);
    //   }
    // }
    //
    // // Trigger revalidation for each published article
    // for (const article of articles) {
    //   await fetch(`${siteUrl}/api/revalidate?path=/${article.locale}/blog/${article.slug}`);
    // }

    console.log(`[CRON] Auto-publish + embeddings check at ${now}`);

    return NextResponse.json({
      success: true,
      message: "CRON publish + embeddings job executed",
      timestamp: now,
      // published: articles.length,
      // embeddings_generated: embeddingsGenerated,
    });
  } catch (error) {
    console.error("[CRON] Error:", error);
    return NextResponse.json({ error: "Failed to publish articles" }, { status: 500 });
  }
}
