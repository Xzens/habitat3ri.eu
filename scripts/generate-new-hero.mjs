/**
 * Generate new hero banner + article covers via XAI and convert to WebP.
 * Usage: node scripts/generate-new-hero.mjs
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
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
if (!API_KEY) {
  console.error("No XAI_API_KEY found");
  process.exit(1);
}

const OUTPUT_DIR = join(import.meta.dirname, "..", "public", "images");

const images = [
  {
    name: "hero/hero-banner-3ri-2026",
    prompt:
      "Wide panoramic view of modern Benelux eco-neighborhood at golden hour, row of sustainable homes with solar panels on roofs, wind turbines in distance, electric cars charging, green gardens with vegetables, smart home displays visible through windows showing energy flows, ultra-photorealistic architectural photography, warm cinematic lighting, teal and orange color grading, 2026 sustainable architecture, utopian prosumer community, wide aspect ratio 16:9",
  },
  {
    name: "blog/article-solar-belgium-2026",
    prompt:
      "Photorealistic top-down aerial view of a modern Belgian brick house roof covered with sleek black monocrystalline solar panels, blue sky with a few clouds, suburban European neighborhood visible in background, bright sunny day, professional drone photography, golden hour lighting highlighting the panels",
  },
  {
    name: "blog/article-heat-pump-2026",
    prompt:
      "Photorealistic modern white Daikin-style air-water heat pump unit installed next to a cream-colored brick European house, autumn garden with orange leaves, installer in background checking pipes, professional HVAC installation photography, warm natural lighting",
  },
  {
    name: "blog/article-prosumer-2026",
    prompt:
      "Futuristic smart home living room with wall-mounted tablet showing real-time energy dashboard (solar production, battery, heat pump), Tesla Powerwall visible in garage through open door, cozy modern Scandinavian interior with plants, warm evening lighting, ultra-photorealistic lifestyle photography",
  },
  {
    name: "blog/article-zonnepanelen-2026",
    prompt:
      "Photorealistic wide shot of modern Dutch row houses in Amsterdam-style architecture with solar panels on all rooftops, visible Tesla Powerwall home batteries mounted on walls, residential street with parked electric cars, overcast Netherlands sky, urban sustainable neighborhood photography",
  },
  {
    name: "blog/article-warmtepomp-isolatie-2026",
    prompt:
      "Photorealistic split-scene horizontal: left half shows a professional craftsman applying thick mineral wool insulation panels on exterior cavity wall of Belgian brick house, right half shows a modern white air-water heat pump unit freshly installed next to the wall, both scenes connected by a natural transition, documentary renovation photography",
  },
];

async function generateImage(img) {
  console.log(`Generating: ${img.name}...`);

  const res = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt: img.prompt,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed ${img.name}: ${res.status} ${err.substring(0, 200)}`);
    return null;
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    console.error(`No image data for ${img.name}`);
    return null;
  }

  const buffer = Buffer.from(b64, "base64");
  const webpPath = join(OUTPUT_DIR, `${img.name}-xai.webp`);
  mkdirSync(dirname(webpPath), { recursive: true });

  // Resize to max 1920x1080 for hero, 1600x900 for articles, quality 82
  const metadata = await sharp(buffer).metadata();
  const isHero = img.name.startsWith("hero/");
  const maxWidth = isHero ? 1920 : 1600;
  const maxHeight = isHero ? 1080 : 900;

  let transformer = sharp(buffer);
  if (metadata.width > maxWidth || metadata.height > maxHeight) {
    transformer = transformer.resize(maxWidth, maxHeight, { fit: "cover", position: "center" });
  }
  await transformer.webp({ quality: 82, effort: 6 }).toFile(webpPath);

  const stats = await sharp(webpPath).metadata();
  console.log(`  Saved WebP: ${webpPath} (${stats.width}x${stats.height})`);
  return webpPath;
}

async function main() {
  console.log(`Generating ${images.length} images via XAI Grok API...\n`);
  for (const img of images) {
    await generateImage(img);
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log("\nDone!");
}

main().catch(console.error);
