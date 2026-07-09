import { NextResponse } from "next/server";
import { z } from "zod";
import { bobexCategories, bobexConfig } from "@/data/bobex-categories";
import { routeToHub } from "@/lib/leadhub";

/**
 * POST /api/submit-lead
 * Routes a lead to the LeadHub (POST /v1/intake, source `habitat3ri_eu`).
 * On ANY Hub failure it falls back to a direct Bobex POST, so no lead is lost.
 *
 * BE/LU → bobex.be affiliate 110451 | NL → bobex.nl affiliate 110495 (fallback only)
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

type ParsedLead = Omit<z.infer<typeof leadSchema>, "consent" | "website">;
type BobexCategory = (typeof bobexCategories)[number];
type BobexCfg = (typeof bobexConfig)[keyof typeof bobexConfig];

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

/** Direct Bobex submission — used only when the Hub is unreachable/declines. */
async function postToBobex(
  lead: ParsedLead,
  category: BobexCategory,
  config: BobexCfg,
): Promise<{ ok: boolean; status: number }> {
  const params = new URLSearchParams({
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
  if (lead.country === "NL") params.set("promoOptin", "true");

  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("[Bobex] fallback POST failed:", err);
    return { ok: false, status: 0 };
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
      return NextResponse.json({ success: true }); // Silent success for bots
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { consent: _c, website: _w, ...lead } = parsed.data;

    const category = bobexCategories.find((c) => c.id === lead.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    const config = bobexConfig[lead.country] || bobexConfig.BE;

    // 1. Primary path: LeadHub intake (Alrootel-first routing; Bobex fallback lives inside the Hub)
    const hub = await routeToHub(
      {
        first_name: lead.firstName,
        last_name: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        postal_code: lead.postalCode,
        country: lead.country,
        bobex_type_id: category.typeId,
        niche_slug: category.id,
        service_needed: category.label.fr,
        message: lead.remarks || `Lead via habitat3ri.eu — ${category.label.fr}`,
        consent_gdpr: true,
        source_page: "/lead-form",
        landing_page: request.headers.get("referer") || undefined,
        utm_source: "habitat3ri.eu",
        utm_medium: "lead_form",
        utm_campaign: "constellation",
        client_ip: ip,
        user_agent: request.headers.get("user-agent"),
      },
      "habitat3ri.eu",
    );

    // 2. Fallback to direct Bobex only if the Hub did not accept the lead
    let bobexSuccess = false;
    let bobexStatus = 0;
    if (hub.action !== "bypass_bobex") {
      const r = await postToBobex(lead, category, config);
      bobexSuccess = r.ok;
      bobexStatus = r.status;
    }

    const routed =
      hub.action === "bypass_bobex"
        ? `Hub (${hub.dispatch_status})`
        : `Bobex fallback ${bobexSuccess ? "✅" : "❌"} (${bobexStatus}) — hub:${hub.reason}`;

    await notifyTelegram(
      `🏠 <b>Nouveau lead Habitat3RI</b>\n` +
        `Nom: ${lead.firstName} ${lead.lastName}\n` +
        `Email: ${lead.email}\n` +
        `Tél: ${lead.phone}\n` +
        `CP: ${lead.postalCode} (${lead.country})\n` +
        `Catégorie: ${category.label.fr} (${category.typeId})\n` +
        `Routage: ${routed}\n` +
        (lead.remarks ? `Message: ${lead.remarks.substring(0, 200)}` : ""),
    );

    console.log(
      `[Lead] ${lead.firstName} ${lead.lastName} | ${lead.country} ${lead.postalCode} | ${category.id} (${category.typeId}) | ${routed}`,
    );

    return NextResponse.json({
      success: true,
      routed: hub.action,
      hub: hub.action === "bypass_bobex" ? hub.lead_uid : null,
      bobex: bobexSuccess,
    });
  } catch (error) {
    console.error("[Submit Lead] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
