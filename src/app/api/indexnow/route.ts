import { NextResponse } from "next/server";

const INDEXNOW_KEY = "satyvo2026indexnow01";
const SITE_URL = "https://habitat3ri.eu";

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow for rapid Bing/Yandex indexing.
 * Body: { urls: string[] }
 * Protected by CRON_SECRET.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "urls array required" }, { status: 400 });
    }

    const fullUrls = urls.map((u: string) =>
      u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`
    );

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "habitat3ri.eu",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls.slice(0, 10000),
      }),
    });

    return NextResponse.json({
      success: res.ok,
      status: res.status,
      submitted: fullUrls.length,
    });
  } catch (error) {
    console.error("[IndexNow] Error:", error);
    return NextResponse.json({ error: "IndexNow submission failed" }, { status: 500 });
  }
}
