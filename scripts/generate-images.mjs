/**
 * Generate images via XAI Grok API and convert to WebP using sharp.
 * Usage: node scripts/generate-images.mjs
 * Requires: XAI_API_KEY env var or reads from E:\Synergy\xai.txt
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import sharp from "sharp";

const XAI_API_URL = "https://api.x.ai/v1/images/generations";

// Read API key
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
    name: "hero/hero-3ri-home",
    prompt:
      "Modern eco-friendly smart home at golden hour with solar panels on roof, green garden, electric car charging station, warm ambient light, photorealistic architectural photography, sustainable living, clean energy aesthetic, blue sky, premium quality",
  },
  {
    name: "blog/solar-panels-belgium",
    prompt:
      "Aerial view of modern Belgian residential rooftop with sleek black monocrystalline solar panels, European suburban neighborhood, bright sunny day, photorealistic, professional photography, energy transition",
  },
  {
    name: "blog/heat-pump-house",
    prompt:
      "Modern white air-to-water heat pump unit installed next to European brick house, professional HVAC installation, clean unit in garden setting, energy efficient heating, photorealistic, warm natural lighting",
  },
  {
    name: "blog/prosumer-home",
    prompt:
      "Futuristic smart home energy dashboard visualization, solar production graph, battery level, heat pump status, digital twin holographic display, dark premium UI with green and blue accents, prosumer energy management",
  },
  {
    name: "blog/solar-panels-netherlands",
    prompt:
      "Modern Dutch row houses with solar panels and home batteries, European residential street, Amsterdam style architecture, sustainable neighborhood, photorealistic, overcast Benelux sky",
  },
  {
    name: "blog/heatpump-insulation",
    prompt:
      "Split view: left side shows professional wall insulation installation with mineral wool, right side shows modern heat pump unit, European house renovation, photorealistic, energy renovation project",
  },
  {
    name: "hero/solteo-solar-calc",
    prompt:
      "Photorealistic solar panel installation on modern house roof, installer working with tools, bright sun, professional photography, clean energy, European residential architecture, blue sky with soft clouds",
  },
  {
    name: "hero/second-brain-ai",
    prompt:
      "Abstract visualization of a neural network brain connected to a green sustainable house, digital connections, flowing energy data streams, dark background with green and blue glowing lines, futuristic AI concept, minimal and elegant",
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
    console.error(`Failed ${img.name}: ${res.status} ${err}`);
    return null;
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    console.error(`No image data for ${img.name}`);
    return null;
  }

  const buffer = Buffer.from(b64, "base64");

  // Convert directly to WebP using sharp
  const webpPath = join(OUTPUT_DIR, `${img.name}-xai.webp`);
  mkdirSync(dirname(webpPath), { recursive: true });

  await sharp(buffer).webp({ quality: 85 }).toFile(webpPath);

  console.log(`  Saved WebP: ${webpPath}`);
  return webpPath;
}

async function main() {
  console.log(`Generating ${images.length} images via XAI Grok API...\n`);

  for (const img of images) {
    await generateImage(img);
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("\nDone!");
}

main().catch(console.error);
