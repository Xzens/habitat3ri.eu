/**
 * Enrichit src/data/editorial-calendar.json avec :
 * - author_slug (Marc / Sophie / Thomas / Nathalie selon niche)
 * - image_prompt (prompt XAI contextualise par titre + categorie + langue)
 * - image (chemin cible /images/blog/<slug>-xai.webp)
 * - slug (derive du titre)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CAL_PATH = join(import.meta.dirname, "..", "src", "data", "editorial-calendar.json");

// Auteur unique (conformité E-E-A-T + AI Act 2026)
const AUTHOR_SLUG = "samuel-thiret";

// Category-specific photographic prompts (language-aware for locale context)
const promptTemplates = {
  solar: {
    fr: "photorealistic aerial drone view of modern Belgian suburban house roof covered with sleek black monocrystalline solar panels, bright blue sky with soft clouds, professional architectural photography, golden hour warm lighting, European residential neighborhood, 2026 sustainable architecture",
    nl: "photorealistic aerial drone view of Dutch row houses with solar panels on all rooftops, Amsterdam-style architecture, urban sustainable neighborhood, overcast Dutch sky, professional architectural photography, 2026 sustainable Benelux",
  },
  insulation: {
    fr: "photorealistic close-up of professional craftsman installing thick mineral wool insulation panels on exterior cavity wall of Belgian brick house, autumn lighting, documentary renovation photography, detail of thermal bridge treatment, 2026 energy renovation",
    nl: "photorealistic close-up of Dutch installer applying cavity wall insulation in spouwmuur of Netherlands brick house, professional renovation photography, warm natural lighting, thermal bridge detail, 2026 energie renovatie",
  },
  heatpump: {
    fr: "photorealistic modern white air-water heat pump unit (Daikin style) installed next to Belgian cream-brick house, autumn garden with colorful leaves, installer checking copper refrigerant pipes, warm natural lighting, professional HVAC installation photography",
    nl: "photorealistic modern air-water warmtepomp unit installed next to Dutch brick house, professional HVAC installation, warm natural lighting, installer in background, 2026 sustainable heating",
  },
  renovation: {
    fr: "photorealistic wide shot of modern Belgian home interior during final renovation phase, wood parquet floors, white walls, designer kitchen island visible, natural light through large windows, Scandinavian-Belgian interior design 2026",
    nl: "photorealistic Dutch renovated living room interior, Scandinavian-Dutch design, modern minimalist, plants, natural light, sustainable materials, architectural interior photography 2026",
  },
  battery: {
    fr: "photorealistic Tesla Powerwall 2 home battery mounted on garage wall of Belgian modern home, connected to solar inverter, LED status display visible, clean technical installation, bright ambient lighting",
    nl: "photorealistic home battery (BYD or Tesla Powerwall) mounted in Dutch garage, connected to zonnepanelen inverter, modern clean installation, sustainable energy storage",
  },
  smartgrid: {
    fr: "futuristic smart home energy dashboard visualization, real-time solar production graph, battery level, heat pump status, holographic digital twin display, dark premium UI with green and blue accents, prosumer energy management, photorealistic",
    nl: "Dutch smart home energy management system display showing real-time zonnepanelen production and verbruik, modern interface, premium UI, photorealistic",
  },
  subsidy: {
    fr: "photorealistic close-up of Belgian couple reviewing energy subsidy documents at kitchen table, prime Wallonie papers visible, warm afternoon lighting, lifestyle photography, 2026 energy renovation planning",
    nl: "photorealistic Dutch couple reviewing ISDE subsidy forms on laptop at home, papers visible on table, warm indoor lighting, renovation planning 2026",
  },
  prosumer: {
    fr: "futuristic Belgian smart home living room with tablet showing energy flow dashboard (solar production, battery, heat pump), wall-mounted display, cozy modern interior with plants, warm evening lighting, ultra-photorealistic lifestyle",
    nl: "Dutch smart home with prosumer energy hub, tablet showing energy dashboard, modern minimalist interior, 2026 sustainable living, photorealistic",
  },
  security: {
    fr: "photorealistic modern Belgian smart home security system, Verisure-style keypad by front door, discreet wireless cameras, family entering home, warm lifestyle photography",
    nl: "photorealistic Dutch smart home beveiligingssysteem, modern alarmsysteem keypad, wireless camera's, veilige woning, lifestyle photography 2026",
  },
  digital: {
    fr: "architectural digital twin visualization of modern Belgian home, 3D wireframe blueprint transition to real photo, energy performance data overlay, futuristic professional architectural rendering, tech-focused",
    nl: "digital twin Dutch home visualization, 3D BIM model blended with real photo, energy data overlay, architectural rendering 2026",
  },
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const calendar = JSON.parse(readFileSync(CAL_PATH, "utf8"));

const enriched = calendar.map((entry) => {
  const slug = slugify(entry.title);
  const tpls = promptTemplates[entry.category] || promptTemplates.solar;
  const prompt = tpls[entry.locale] || tpls.fr;
  const author_slug = AUTHOR_SLUG;
  return {
    ...entry,
    slug,
    author_slug,
    image_prompt: prompt,
    image: `/images/blog/calendar/${slug}-xai.webp`,
  };
});

writeFileSync(CAL_PATH, JSON.stringify(enriched, null, 2));

const stats = {
  total: enriched.length,
  byCategory: {},
  byAuthor: {},
  byLocale: {},
};
for (const e of enriched) {
  stats.byCategory[e.category] = (stats.byCategory[e.category] || 0) + 1;
  stats.byAuthor[e.author_slug] = (stats.byAuthor[e.author_slug] || 0) + 1;
  stats.byLocale[e.locale] = (stats.byLocale[e.locale] || 0) + 1;
}

console.log("Enriched " + stats.total + " entries");
console.log("By category:", stats.byCategory);
console.log("By author:", stats.byAuthor);
console.log("By locale:", stats.byLocale);
console.log("\nSample entry:", JSON.stringify(enriched[0], null, 2));
