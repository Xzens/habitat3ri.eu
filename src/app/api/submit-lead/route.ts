import { NextResponse } from "next/server";
import { z } from "zod";
import { bobexCategories, bobexConfig } from "@/data/bobex-categories";

/**
 * POST /api/submit-lead
 * Submit a lead to Bobex API + Telegram notification.
 * Identical pattern to Constellation-20 sites submit-lead.php.
 *
 * BE/LU → bobex.be affiliate 110451
 * NL    → bobex.nl affiliate 110495
 */

const leadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  postalCode: z.string().min(4).max(10),
  country: z.enum(["BE", "NL", "LU", "FR"]),
  categoryId: z.string().min(1),
  remarks: z.string().max(2000).optional(),
  locale: z.string().max(5).optional(),
  consent: z.literal("on"),
  // Honeypot
  website: z.string().max(0).optional(),
});

// Rate limiting
const RATE_LIMIT_WINDOW = 3600_000; // 1 hour
const MAX_LEADS_PER_IP = 10;
const ipLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  ipLog.set(ip, recent);
  if (recent.length >= MAX_LEADS_PER_IP) return true;
  recent.push(now);
  return false;
}

async function notifyTelegram(msg: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
    });
  } catch {
    // silent fail
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { consent: _c, website: _w, ...lead } = parsed.data;

    // Find Bobex type.id
    const category = bobexCategories.find((c) => c.id === lead.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Get country-specific Bobex config
    const config = bobexConfig[lead.country] || bobexConfig.BE;

    // Submit to Bobex API
    const bobexParams = new URLSearchParams({
      "type.id": String(category.typeId),
      aff: config.affiliateId,
      language: lead.locale === "nl" ? "nl" : lead.locale === "de" ? "de" : "fr",
      XML_country: config.country,
      companyType: "label.companytype.consumer",
      XML_firstname: lead.firstName,
      XML_lastname: lead.lastName,
      XML_postcode: lead.postalCode,
      XML_telephone: lead.phone,
      XML_email: lead.email,
      XML_remarks: lead.remarks || `Lead via habitat3ri.eu — ${category.label.fr}`,
      utm_source: "habitat3ri.eu",
      utm_medium: "lead_form",
      utm_campaign: "constellation",
    });

    // Add NL-specific params
    if (lead.country === "NL") {
      bobexParams.set("promoOptin", "true");
    }

    let bobexSuccess = false;
    let bobexStatus = 0;
    try {
      const bobexRes = await fetch(config.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bobexParams.toString(),
      });
      bobexSuccess = bobexRes.ok;
      bobexStatus = bobexRes.status;
    } catch (err) {
      console.error("[Bobex] API call failed:", err);
    }

    // Telegram notification
    await notifyTelegram(
      `🏠 <b>Nouveau lead Habitat3RI</b>\n` +
        `Nom: ${lead.firstName} ${lead.lastName}\n` +
        `Email: ${lead.email}\n` +
        `Tél: ${lead.phone}\n` +
        `CP: ${lead.postalCode} (${lead.country})\n` +
        `Catégorie: ${category.label.fr} (${category.typeId})\n` +
        `Bobex ${lead.country}: ${bobexSuccess ? "✅" : "❌"} (${bobexStatus})\n` +
        `Affiliate: ${config.affiliateId}\n` +
        (lead.remarks ? `Message: ${lead.remarks.substring(0, 200)}` : "")
    );

    console.log(
      `[Lead] ${lead.firstName} ${lead.lastName} | ${lead.country} ${lead.postalCode} | ${category.id} (${category.typeId}) | Bobex: ${bobexSuccess}`
    );

    return NextResponse.json({
      success: true,
      bobex: bobexSuccess,
    });
  } catch (error) {
    console.error("[Submit Lead] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
