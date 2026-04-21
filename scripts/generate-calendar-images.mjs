/**
 * Genere les 182 images d'articles du calendrier editorial via XAI.
 * Resume au dernier article traite (reprise si interrompu).
 *
 * Usage :
 *   node scripts/generate-calendar-images.mjs                    # tous les articles
 *   node scripts/generate-calendar-images.mjs --limit=20         # 20 premiers
 *   node scripts/generate-calendar-images.mjs --category=solar   # filtrer
 *   node scripts/generate-calendar-images.mjs --only-missing     # skip existants
 */
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import sharp from "sharp";

const XAI_API_URL = "https://api.x.ai/v1/images/generations";
const CAL_PATH = join(import.meta.dirname, "..", "src", "data", "editorial-calendar.json");
const IMG_ROOT = join(import.meta.dirname, "..", "public");

// Args parsing
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const CATEGORY = args.category || null;
const ONLY_MISSING = args["only-missing"] || false;

// API key
let API_KEY = process.env.XAI_API_KEY;
if (!API_KEY) {
  const xaiFile = "E:/Synergy/xai.txt";
  if (existsSync(xaiFile)) {
    const content = readFileSync(xaiFile, "utf8");
    const match = content.match(/Bearer\s+(xai-[a-zA-Z0-9]+)/);
    if (match) API_KEY = match[1];
  }
}
if (!API_KEY) {
  console.error("No XAI_API_KEY found");
  process.exit(1);
}

const calendar = JSON.parse(readFileSync(CAL_PATH, "utf8"));

let queue = calendar;
if (CATEGORY) queue = queue.filter((e) => e.category === CATEGORY);
if (ONLY_MISSING) {
  queue = queue.filter((e) => {
    const fullPath = join(IMG_ROOT, e.image.replace(/^\//, ""));
    return !existsSync(fullPath);
  });
}
queue = queue.slice(0, LIMIT);

console.log("Will process " + queue.length + " images...\n");

async function generateOne(entry) {
  const fullPath = join(IMG_ROOT, entry.image.replace(/^\//, ""));

  if (existsSync(fullPath)) {
    console.log("  SKIP " + entry.image + " (existe deja)");
    return "skip";
  }

  // Include title context in prompt for uniqueness
  const contextPrompt = entry.image_prompt + ". Scene theme: " + entry.title;

  const res = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt: contextPrompt,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("  FAIL " + entry.slug + ": " + res.status + " " + err.substring(0, 150));
    return "fail";
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    console.error("  FAIL " + entry.slug + ": no b64_json");
    return "fail";
  }

  const buffer = Buffer.from(b64, "base64");
  mkdirSync(dirname(fullPath), { recursive: true });

  await sharp(buffer)
    .resize(1600, 900, { fit: "cover", position: "center" })
    .webp({ quality: 80, effort: 6 })
    .toFile(fullPath);

  const stats = await sharp(fullPath).metadata();
  console.log("  OK " + entry.image + " (" + stats.width + "x" + stats.height + ")");
  return "ok";
}

async function main() {
  const results = { ok: 0, fail: 0, skip: 0 };
  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i];
    process.stdout.write("[" + (i + 1) + "/" + queue.length + "] " + entry.locale + " " + entry.category + " - " + entry.title.substring(0, 60) + "\n");
    try {
      const r = await generateOne(entry);
      results[r]++;
    } catch (err) {
      console.error("  EXCEPTION " + entry.slug + ": " + err.message);
      results.fail++;
    }
    // Respect API rate limits (avoid 429)
    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log("\n--- SUMMARY ---");
  console.log("OK:    " + results.ok);
  console.log("SKIP:  " + results.skip);
  console.log("FAIL:  " + results.fail);
}

main().catch(console.error);
