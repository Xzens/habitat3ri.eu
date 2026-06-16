import "server-only";
import crypto from "crypto";

/**
 * LeadHub intake client — POST https://hub.benelux-solar.com/v1/intake
 * Mirrors the PHP SatyvoRouter contract used across the Constellation-20 sites:
 *   Authorization: Bearer <LEADHUB_API_KEY>
 *   X-LeadHub-Source: <slug>
 *   X-LeadHub-Timestamp: <unix seconds>
 *   X-LeadHub-Signature: HMAC-SHA256("{ts}.{body}", LEADHUB_API_KEY)  (hex)
 * On any failure → { action: "passthrough" } so the caller falls back to Bobex
 * (fail-graceful: zero leads lost).
 */

const HUB_URL = process.env.LEADHUB_HUB_URL || "https://hub.benelux-solar.com/v1/intake";
const API_KEY = process.env.LEADHUB_API_KEY || "";
const SOURCE_SLUG = process.env.LEADHUB_SOURCE_SLUG || "habitat3ri_eu";
const TIMEOUT_MS = 5000;

export type HubLead = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  bobex_type_id: number;
  niche_slug?: string;
  service_needed?: string;
  building_type?: string;
  owner_status?: string;
  urgency?: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  consent_gdpr?: boolean;
  source_page?: string;
  landing_page?: string;
  client_ip?: string | null;
  user_agent?: string | null;
};

export type HubResult =
  | { action: "bypass_bobex"; lead_uid: string | null; decision: unknown; dispatch_status: string }
  | { action: "passthrough"; reason: string };

function buildPayload(lead: HubLead, sourceDomain: string | null) {
  return {
    source_slug: SOURCE_SLUG,
    source_domain: sourceDomain,
    source_page: lead.source_page ?? null,
    landing_page: lead.landing_page ?? null,
    first_name: lead.first_name ?? null,
    last_name: lead.last_name ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    address1: lead.address1 ?? null,
    postal_code: lead.postal_code ?? null,
    city: lead.city ?? null,
    country: lead.country ?? "BE",
    bobex_type_id: Number(lead.bobex_type_id || 0),
    niche_slug: lead.niche_slug ?? null,
    service_needed: lead.service_needed ?? null,
    building_type: lead.building_type ?? null,
    owner_status: lead.owner_status ?? null,
    urgency: lead.urgency ?? null,
    message: lead.message ?? null,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    utm_content: lead.utm_content ?? null,
    utm_term: lead.utm_term ?? null,
    consent_gdpr: Boolean(lead.consent_gdpr ?? false),
    ip_hash: null,
    client_ip: lead.client_ip ?? null,
    user_agent: lead.user_agent ?? null,
    edge_request_id: `edge_${crypto.randomUUID()}`,
    edge_timestamp: new Date().toISOString(),
  };
}

export async function routeToHub(lead: HubLead, sourceDomain: string | null): Promise<HubResult> {
  if (!API_KEY || !SOURCE_SLUG) return { action: "passthrough", reason: "config_missing" };

  const body = JSON.stringify(buildPayload(lead, sourceDomain));
  const ts = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHmac("sha256", API_KEY).update(`${ts}.${body}`, "utf8").digest("hex");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(HUB_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "X-LeadHub-Source": SOURCE_SLUG,
        "X-LeadHub-Timestamp": ts,
        "X-LeadHub-Signature": signature,
      },
      body,
      signal: controller.signal,
    });
    if (!res.ok) return { action: "passthrough", reason: `hub_http_${res.status}` };
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; lead_uid?: string; decision?: unknown; dispatch_status?: string }
      | null;
    if (!data || !data.success) return { action: "passthrough", reason: "hub_returned_error" };
    return {
      action: "bypass_bobex",
      lead_uid: data.lead_uid ?? null,
      decision: data.decision ?? null,
      dispatch_status: data.dispatch_status ?? "unknown",
    };
  } catch {
    return { action: "passthrough", reason: "hub_unreachable" };
  } finally {
    clearTimeout(timer);
  }
}
