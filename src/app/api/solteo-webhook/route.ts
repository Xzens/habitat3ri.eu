import { NextResponse } from "next/server";

/**
 * Solteo Webhook — Centralized for the entire Habitat3RI constellation.
 * Single companyId routes to the correct Bobex type.id based on the lead data.
 *
 * Solteo config URL: https://habitat3ri.eu/api/solteo-webhook
 * Events: lead_created, client_created, project_created, quote_signed
 *
 * The same companyId (55ac3311-28fe-47dd-8d28-91238edb89b0) is used
 * across all constellation sites. Routing is done by the webhook based
 * on the lead's source/origin or project type.
 */

const SOLTEO_COMPANY_ID = "55ac3311-28fe-47dd-8d28-91238edb89b0";

// Bobex type.ids per niche
const BOBEX_TYPE_IDS: Record<string, string> = {
  solaire: "11364",
  pac: "11428",
  isolation: "11427",
  toiture: "11962",
  facade: "11986",
  cuisine: "100001",
  sdb: "11995",
  alarme: "11406",
  batterie: "100053",
  chassis: "11452",
  borne: "100061",
  adoucisseur: "11982",
  veranda: "30163",
  demoussage: "11992",
  electricite: "12009",
  chaudiere: "11426",
  ventilation: "11453",
};

// Bobex affiliate IDs per country
const BOBEX_CONFIG: Record<string, { affiliateId: string; apiUrl: string }> = {
  BE: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld" },
  NL: { affiliateId: "110495", apiUrl: "https://www.bobex.nl/bobexnl/control/partner_concours_withheld" },
  LU: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld" },
  FR: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld" },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function notifyTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
  } catch {
    console.error("[Telegram] Notification failed");
  }
}

async function forwardToBobex(lead: Record<string, string>, typeId: string, country: string) {
  const config = BOBEX_CONFIG[country] || BOBEX_CONFIG.BE;

  const params = new URLSearchParams({
    "type.id": typeId,
    aff: config.affiliateId,
    language: "fr",
    XML_country: country,
    companyType: "label.companytype.consumer",
    XML_firstname: lead.firstName || lead.first_name || "",
    XML_lastname: lead.lastName || lead.last_name || "",
    XML_postcode: lead.postalCode || lead.postal_code || "",
    XML_telephone: lead.phone || "",
    XML_email: lead.email || "",
    XML_remarks: `Solteo lead via habitat3ri.eu — ${lead.projectType || "solaire"}`,
    utm_source: "habitat3ri.eu",
    utm_medium: "solteo_webhook",
    utm_campaign: "constellation",
  });

  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    return { success: res.ok, status: res.status };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event || body.type || "unknown";
    const lead = body.data || body.lead || body;

    console.log(`[Solteo Webhook] Event: ${event}`, JSON.stringify(lead).substring(0, 500));

    // Determine niche from project type or source
    const projectType = (lead.projectType || lead.project_type || "solaire").toLowerCase();
    const typeId = BOBEX_TYPE_IDS[projectType] || BOBEX_TYPE_IDS.solaire;

    // Determine country from postal code or explicit field
    let country = (lead.country || "BE").toUpperCase();
    const postalCode = lead.postalCode || lead.postal_code || "";
    if (postalCode.length === 4) {
      const pc = parseInt(postalCode, 10);
      if (pc >= 1000 && pc <= 9999 && country === "BE") country = "BE";
      if (postalCode.startsWith("L-")) country = "LU";
    }
    if (postalCode.length === 5) country = "FR";
    if (/^\d{4}\s?[A-Z]{2}$/.test(postalCode)) country = "NL";

    // Forward to Bobex on lead_created
    let bobexResult = null;
    if (event === "lead_created" || event === "client_created") {
      bobexResult = await forwardToBobex(lead, typeId, country);
    }

    // Telegram notification
    await notifyTelegram(
      `⚡ <b>Solteo Lead — Habitat3RI</b>\n` +
        `Event: ${event}\n` +
        `Nom: ${lead.firstName || ""} ${lead.lastName || ""}\n` +
        `Email: ${lead.email || ""}\n` +
        `Tél: ${lead.phone || ""}\n` +
        `CP: ${postalCode} (${country})\n` +
        `Type: ${projectType} (Bobex ${typeId})\n` +
        (bobexResult ? `Bobex: ${bobexResult.success ? "OK" : "FAILED"}` : "")
    );

    return NextResponse.json({
      received: true,
      event,
      bobex: bobexResult,
    });
  } catch (error) {
    console.error("[Solteo Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
