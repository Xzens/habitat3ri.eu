import { NextResponse } from "next/server";

/**
 * CRON Job: Auto-publish scheduled articles
 * Runs every 2 days at 06:00 UTC (configured in vercel.json)
 *
 * In production with Supabase:
 * 1. Fetches articles where status='scheduled' AND scheduled_at <= now
 * 2. Updates their status to 'published' and sets published_at
 * 3. Optionally triggers revalidation of blog pages
 */
export async function GET(request: Request) {
  // Verify CRON secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // In production with Supabase:
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
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
    // // Trigger revalidation for each published article
    // for (const article of articles) {
    //   await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/${article.locale}/blog/${article.slug}`);
    // }

    console.log(`[CRON] Auto-publish check at ${now}`);

    return NextResponse.json({
      success: true,
      message: "CRON publish job executed",
      timestamp: now,
      // published: articles.length, // uncomment with Supabase
    });
  } catch (error) {
    console.error("[CRON] Error:", error);
    return NextResponse.json({ error: "Failed to publish articles" }, { status: 500 });
  }
}
