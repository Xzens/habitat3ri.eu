/**
 * Regenere les images manquantes avec des prompts plus simples / generiques.
 * Pour les 4 derniers echecs (xAI 500 permanent sur prompts trop specifiques).
 */
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import sharp from "sharp";

const XAI_API_URL = "https://api.x.ai/v1/images/generations";

let API_KEY = process.env.XAI_API_KEY;
if (!API_KEY) {
  const xaiFile = "E:/Synergy/xai.txt";
  if (existsSync(xaiFile)) {
    const content = readFileSync(xaiFile, "utf8");
    const match = content.match(/Bearer\s+(xai-[a-zA-Z0-9]+)/);
    if (match) API_KEY = match[1];
  }
}

const CAL_PATH = join(import.meta.dirname, "..", "src", "data", "editorial-calendar.json");
const IMG_ROOT = join(import.meta.dirname, "..", "public");

// Simplified fallback prompts by category (safe, non-specific)
const fallbackPrompts = {
  solar: "photorealistic solar panels on modern European house roof, bright sky, professional architectural photography, clean composition",
  insulation: "photorealistic modern European house exterior wall with visible insulation detail, renovation context, warm natural lighting",
  heatpump: "photorealistic white air-water heat pump unit beside modern European home, clean installation, natural daylight",
  battery: "photorealistic modern home battery installation in garage, clean technical setup, bright lighting",
  security: "photorealistic modern European home exterior at dusk, warm interior lighting visible, safe residential neighborhood",
  smartgrid: "modern smart home energy dashboard displayed on tablet, clean tech UI, neutral background",
  renovation: "photorealistic modern European home renovation, craftsman at work, bright natural lighting",
  subsidy: "photorealistic couple reviewing documents at kitchen table in modern European home, warm afternoon light",
  prosumer: "modern European smart home living room with solar energy dashboard, cozy interior, warm lighting",
  digital: "architectural 3D rendering of modern European home, tech-focused, clean composition",
};

const cal = JSON.parse(readFileSync(CAL_PATH, "utf8"));
const queue = cal.filter((e) => !existsSync(join(IMG_ROOT, e.image.replace(/^\//, ""))));

console.log("Missing: " + queue.length);

async function gen(entry) {
  const prompt = fallbackPrompts[entry.category] || fallbackPrompts.solar;
  const res = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt,
      n: 1,
      response_format: "b64_json",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    return { ok: false, err: res.status + " " + t.substring(0, 150) };
  }
  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) return { ok: false, err: "no b64" };

  const buf = Buffer.from(b64, "base64");
  const path = join(IMG_ROOT, entry.image.replace(/^\//, ""));
  mkdirSync(dirname(path), { recursive: true });
  await sharp(buf).resize(1600, 900, { fit: "cover", position: "center" }).webp({ quality: 80 }).toFile(path);
  return { ok: true };
}

for (const e of queue) {
  console.log("Generating: " + e.slug);
  try {
    const r = await gen(e);
    console.log("  " + (r.ok ? "OK" : "FAIL " + r.err));
  } catch (err) {
    console.log("  EXCEPTION " + err.message);
  }
  await new Promise((r) => setTimeout(r, 3000));
}

console.log("\nDone");
