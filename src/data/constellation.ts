export type ConstellationSite = {
  name: string;
  url: string;
  description: Record<string, string>;
  category: "renovation" | "energy" | "security" | "digital" | "services";
  lang: "fr" | "nl" | "multi";
  country: ("be" | "nl" | "lu" | "fr")[];
};

export const constellation: ConstellationSite[] = [
  // Rénovation & Finitions
  {
    name: "Rénovation Cuisine & SDB",
    url: "https://renovation-cuisine-sdb.be",
    description: {
      fr: "Rénovation complète de cuisines et salles de bains en Belgique.",
      nl: "Volledige renovatie van keukens en badkamers in België.",
    },
    category: "renovation",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Keuken & Badkamer Renovatie",
    url: "https://keuken-badkamer-renovatie.nl",
    description: {
      fr: "Rénovation de cuisines et salles de bains aux Pays-Bas.",
      nl: "Keuken- en badkamerrenovatie in Nederland.",
    },
    category: "renovation",
    lang: "nl",
    country: ["nl"],
  },
  {
    name: "Finitions Intérieures",
    url: "https://finitions-interieures.be",
    description: {
      fr: "Peinture, plâtre, revêtements de sol et finitions intérieures de qualité.",
      nl: "Schilderwerk, pleisterwerk, vloerbekleding en kwalitatieve binnenafwerking.",
    },
    category: "renovation",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Extension Maison & Maçonnerie",
    url: "https://extension-maison-maconnerie.be",
    description: {
      fr: "Extensions de maison, maçonnerie et gros œuvre en Belgique.",
      nl: "Woninguitbreidingen, metselwerk en ruwbouw in België.",
    },
    category: "renovation",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Toiture & Façades Renov",
    url: "https://toiture-facades-renov.be",
    description: {
      fr: "Rénovation de toitures et façades — étanchéité, bardage, isolation extérieure.",
      nl: "Renovatie van daken en gevels — waterdichting, gevelbekleding, buitenisolatie.",
    },
    category: "renovation",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Dak & Gevel Renovatie",
    url: "https://dak-gevel-renovatie.nl",
    description: {
      fr: "Rénovation de toitures et façades aux Pays-Bas.",
      nl: "Dak- en gevelrenovatie in Nederland.",
    },
    category: "renovation",
    lang: "nl",
    country: ["nl"],
  },
  // Énergie & Isolation
  {
    name: "Panneaux Solaires & Batterie",
    url: "https://panneauxsolaires-batterie.be",
    description: {
      fr: "Installation de panneaux solaires et systèmes de batteries en Belgique.",
      nl: "Installatie van zonnepanelen en batterijsystemen in België.",
    },
    category: "energy",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Zonnepaneel & Batterij",
    url: "https://zonnepaneel-batterij.nl",
    description: {
      fr: "Installation de panneaux solaires et batteries aux Pays-Bas.",
      nl: "Installatie van zonnepanelen en batterijen in Nederland.",
    },
    category: "energy",
    lang: "nl",
    country: ["nl"],
  },
  {
    name: "Pompe à Chaleur & Isolation",
    url: "https://pompeachaleur-isolation.be",
    description: {
      fr: "Pompes à chaleur et solutions d'isolation performantes en Belgique.",
      nl: "Warmtepompen en hoogwaardige isolatie-oplossingen in België.",
    },
    category: "energy",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Warmtepomp & Isolatie",
    url: "https://warmtepomp-isolatie.nl",
    description: {
      fr: "Pompes à chaleur et isolation aux Pays-Bas.",
      nl: "Warmtepompen en isolatie in Nederland.",
    },
    category: "energy",
    lang: "nl",
    country: ["nl"],
  },
  // Sécurité & Assurance
  {
    name: "Alarme & Sécurité Maison",
    url: "https://alarme-securite-maison.be",
    description: {
      fr: "Systèmes d'alarme et sécurité résidentielle en Belgique.",
      nl: "Alarmsystemen en residentiële beveiliging in België.",
    },
    category: "security",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "Alarmsysteem & Beveiliging",
    url: "https://alarmsysteem-beveiliging-huis.nl",
    description: {
      fr: "Systèmes d'alarme et sécurité résidentielle aux Pays-Bas.",
      nl: "Alarmsystemen en woningbeveiliging in Nederland.",
    },
    category: "security",
    lang: "nl",
    country: ["nl"],
  },
  {
    name: "Assurance Habitation",
    url: "https://assurance-habitation-incendie.be",
    description: {
      fr: "Assurance habitation et incendie optimisée pour les maisons rénovées.",
      nl: "Woning- en brandverzekering geoptimaliseerd voor gerenoveerde woningen.",
    },
    category: "security",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "AssureHomeProtect",
    url: "https://assurehomeprotect.be",
    description: {
      fr: "Protection complète pour votre habitation — assurance et sécurité intégrées.",
      nl: "Volledige bescherming voor uw woning — geïntegreerde verzekering en beveiliging.",
    },
    category: "security",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "AutoAssure",
    url: "https://autoassure.be",
    description: {
      fr: "Assurance automobile et mobilité verte pour véhicules électriques.",
      nl: "Autoverzekering en groene mobiliteit voor elektrische voertuigen.",
    },
    category: "security",
    lang: "fr",
    country: ["be"],
  },
  // Digital & Innovation
  {
    name: "Clone Numérique",
    url: "https://clonenumerique.be",
    description: {
      fr: "Jumeau numérique de votre habitation — simulation et planification 3D.",
      nl: "Digitale tweeling van uw woning — simulatie en 3D-planning.",
    },
    category: "digital",
    lang: "fr",
    country: ["be"],
  },
  // Services & Professionnels
  {
    name: "Les Pros de Ma Ville",
    url: "https://lesprosdemaville.be",
    description: {
      fr: "Trouvez les meilleurs professionnels certifiés dans votre ville en Belgique.",
      nl: "Vind de beste gecertificeerde professionals in uw stad in België.",
    },
    category: "services",
    lang: "fr",
    country: ["be"],
  },
  {
    name: "De Pros van Mijn Stad",
    url: "https://deprosvanmijnstad.nl",
    description: {
      fr: "Trouvez les meilleurs professionnels certifiés aux Pays-Bas.",
      nl: "Vind de beste gecertificeerde vakmensen in uw stad in Nederland.",
    },
    category: "services",
    lang: "nl",
    country: ["nl"],
  },
  {
    name: "Fachleít Dem Gemeng",
    url: "https://fachleitdemgemeng.lu",
    description: {
      fr: "Annuaire des professionnels qualifiés au Luxembourg.",
      nl: "Gids van gekwalificeerde professionals in Luxemburg.",
    },
    category: "services",
    lang: "multi",
    country: ["lu"],
  },
  {
    name: "Produits Nettoyage Écologique",
    url: "https://produits-nettoyage-ecologique-liege-wallonie.be",
    description: {
      fr: "Produits de nettoyage écologiques et biodégradables en Wallonie.",
      nl: "Ecologische en biologisch afbreekbare schoonmaakproducten in Wallonië.",
    },
    category: "services",
    lang: "fr",
    country: ["be"],
  },
];

export function getConstellationByCategory(category: ConstellationSite["category"]) {
  return constellation.filter((site) => site.category === category);
}

export function getConstellationByLang(lang: "fr" | "nl") {
  return constellation.filter((site) => site.lang === lang || site.lang === "multi");
}
