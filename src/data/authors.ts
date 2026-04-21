/**
 * Auteur unique pour Habitat3RI.eu — conformité E-E-A-T + AI Act 2026
 *
 * Samuel Thiret est le fondateur et administrateur de Satyvo SA (BCE 0791.828.816),
 * personne physique réelle et vérifiable. Il signe tous les articles du site.
 *
 * Le contenu rédactionnel est produit avec assistance IA (xAI Grok), puis relu
 * et supervisé avant publication. Cette pratique est transparente et conforme
 * à l'EU AI Act 2026 (disclosure obligatoire pour YMYL).
 */

export type Author = {
  slug: string;
  name: string;
  role: Record<string, string>;
  bio: Record<string, string>;
  expertise: string[];
  location: string;
  image: string;
  linkedin?: string;
  website: string;
  /** Entité éditrice (personne morale derrière le site). */
  organization: {
    name: string;
    legalForm: string;
    bce: string;
    vat: string;
    address: string;
    country: string;
  };
};

export const samuelThiret: Author = {
  slug: "samuel-thiret",
  name: "Samuel Thiret",
  role: {
    fr: "Fondateur Satyvo SA & Éditeur Habitat3RI.eu",
    nl: "Oprichter Satyvo SA & Redacteur Habitat3RI.eu",
    en: "Founder Satyvo SA & Editor Habitat3RI.eu",
    de: "Gründer Satyvo SA & Herausgeber Habitat3RI.eu",
    lb: "Grënner Satyvo SA & Editeur Habitat3RI.eu",
  },
  bio: {
    fr: "Samuel Thiret est le fondateur de Satyvo SA, entreprise belge dédiée à la rénovation durable et à la Troisième Révolution Industrielle au Benelux. Il supervise la ligne éditoriale d'Habitat3RI.eu et anime un réseau de plus de 30 sites spécialisés en énergie renouvelable, isolation, pompes à chaleur et sécurité résidentielle.",
    nl: "Samuel Thiret is de oprichter van Satyvo SA, een Belgisch bedrijf gewijd aan duurzame renovatie en de Derde Industriële Revolutie in de Benelux. Hij overziet de redactionele lijn van Habitat3RI.eu en beheert een netwerk van meer dan 30 gespecialiseerde websites over hernieuwbare energie, isolatie, warmtepompen en woningbeveiliging.",
    en: "Samuel Thiret is the founder of Satyvo SA, a Belgian company dedicated to sustainable renovation and the Third Industrial Revolution in the Benelux. He oversees the editorial line of Habitat3RI.eu and manages a network of 30+ specialised websites covering renewable energy, insulation, heat pumps and residential security.",
    de: "Samuel Thiret ist Gründer der Satyvo SA, eines belgischen Unternehmens, das sich der nachhaltigen Sanierung und der Dritten Industriellen Revolution in den Benelux-Ländern widmet. Er betreut die redaktionelle Linie von Habitat3RI.eu und leitet ein Netzwerk von über 30 Fachwebsites zu erneuerbarer Energie, Dämmung, Wärmepumpen und Wohnsicherheit.",
    lb: "De Samuel Thiret ass de Grënner vun der Satyvo SA, enger belscher Firma, déi sech der nohaltiger Renovatioun an der Drëtter Industrieller Revolutioun am Benelux widmet. Hien iwwerwaacht d'redaktionnell Linn vun Habitat3RI.eu a leet e Netzwierk vu méi wéi 30 spezialiséierten Websiten zu erneierbarer Energie, Isolatioun, Wärmepompelen a Wunnsécherheet.",
  },
  expertise: [
    "rénovation durable",
    "Troisième Révolution Industrielle",
    "prosumer",
    "écosystème digital",
    "stratégie éditoriale",
    "SEO multilingue",
  ],
  location: "Malmedy, Belgique",
  image: "/images/authors/samuel-thiret.webp",
  website: "https://satyvo.be",
  organization: {
    name: "Satyvo SA",
    legalForm: "Société anonyme de droit belge",
    bce: "0791.828.816",
    vat: "BE0791828816",
    address: "Route de Chôdes 38, 4960 Malmedy, Belgique",
    country: "BE",
  },
};

export const authors: Author[] = [samuelThiret];

/** Retourne toujours Samuel Thiret — auteur unique conforme E-E-A-T + AI Act. */
export function getAuthorForCategory(_category: string): Author {
  return samuelThiret;
}

/** Lookup auteur par slug — retourne Samuel Thiret par défaut. */
export function getAuthorBySlug(_slug: string): Author {
  return samuelThiret;
}
