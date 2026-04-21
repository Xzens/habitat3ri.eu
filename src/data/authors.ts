/**
 * Auteurs E-E-A-T pour Habitat3RI.eu
 * Basé sur le pattern Constellation Satyvo SA (shared/data/authors.json)
 *
 * Chaque auteur signe les articles dans sa niche d'expertise.
 * Pour YMYL (assurance/santé), préférer Marc ou Nathalie.
 * Pour rénovation énergétique, préférer Sophie.
 * Pour immobilier/digital, préférer Thomas.
 */

export type Author = {
  slug: string;
  name: string;
  role: Record<string, string>; // fr/nl/en/de/lb
  bio: Record<string, string>;
  expertise: string[];
  years_experience: number;
  location: string;
  image: string;
  linkedin?: string;
  niches: string[]; // categories this author signs
};

export const authors: Author[] = [
  {
    slug: "marc-dumont",
    name: "Marc Dumont",
    role: {
      fr: "Courtier en assurances & expert sécurité résidentielle",
      nl: "Verzekeringsmakelaar & woningveiligheid expert",
      en: "Insurance broker & residential security expert",
      de: "Versicherungsmakler & Wohnsicherheitsexperte",
      lb: "Versécherungsmakler & Wunnen-Séierheetsexpert",
    },
    bio: {
      fr: "Courtier indépendant depuis 15 ans à Liège, Marc est spécialisé en assurance habitation, sécurité connectée et prévention incendie/cambriolage pour maisons rénovées en Wallonie et au Luxembourg.",
      nl: "Onafhankelijk makelaar sinds 15 jaar in Luik, Marc is gespecialiseerd in woningverzekering, slimme beveiliging en brand-/inbraakpreventie voor gerenoveerde huizen in Wallonië en Luxemburg.",
      en: "Independent broker for 15 years in Liège, Marc specialises in home insurance, smart security and fire/burglary prevention for renovated homes in Wallonia and Luxembourg.",
      de: "Unabhängiger Makler seit 15 Jahren in Lüttich, Marc ist auf Hausversicherung, Smart Security und Brand-/Einbruchprävention für sanierte Häuser in Wallonien und Luxemburg spezialisiert.",
      lb: "Onofhängege Makler zënter 15 Joer zu Léck, de Marc ass spezialiséiert op Wunnversécherung, Smart Security a Brand-/Abrochprevention fir renovéiert Haiser an der Wallonie an zu Lëtzebuerg.",
    },
    expertise: ["assurance habitation", "alarme connectée", "sécurité résidentielle", "prévention incendie", "RC locative"],
    years_experience: 15,
    location: "Liège, Belgique",
    image: "/images/authors/marc-dumont.webp",
    linkedin: "https://www.linkedin.com/in/marc-dumont-satyvo",
    niches: ["security", "insurance"],
  },
  {
    slug: "sophie-claessens",
    name: "Sophie Claessens",
    role: {
      fr: "Conseillère en rénovation énergétique & prime énergie",
      nl: "Adviseur energetische renovatie & energiepremies",
      en: "Energy renovation advisor & subsidy specialist",
      de: "Beraterin für energetische Sanierung & Förderungen",
      lb: "Beroderin fir Energetesch Renovatioun & Subventiounen",
    },
    bio: {
      fr: "Ingénieure énergie diplômée Louvain-la-Neuve, 12 ans d'expérience en Wallonie. Sophie guide les propriétaires à chaque étape : audit PEB, pompes à chaleur, isolation, panneaux solaires, primes 2026 et couplage prosumer.",
      nl: "Afgestudeerd energie-ingenieur aan Louvain-la-Neuve, 12 jaar ervaring in Wallonië en Vlaanderen. Sophie begeleidt eigenaars in elke fase: EPC-audit, warmtepompen, isolatie, zonnepanelen, premies 2026 en prosumer-koppeling.",
      en: "Energy engineer graduated from Louvain-la-Neuve, 12 years experience in Belgium. Sophie guides homeowners through every stage: EPC audit, heat pumps, insulation, solar panels, 2026 subsidies and prosumer coupling.",
      de: "Diplom-Energie-Ingenieurin (Louvain-la-Neuve), 12 Jahre Erfahrung in Belgien. Sophie begleitet Hausbesitzer in jeder Phase: Energieaudit, Wärmepumpen, Dämmung, Solaranlagen, Förderungen 2026 und Prosumer-Kopplung.",
      lb: "Diplom-Energieingenieurin vu Louvain-la-Neuve, 12 Joer Erfahrung a Belsch. D'Sophie begleet d'Proprietaire op all Etapp: Energieaudit, Wärmepompel, Isolatioun, Sonnepanneauen, Subsiden 2026 a Prosumer-Kopplung.",
    },
    expertise: ["pompe à chaleur", "isolation thermique", "panneaux solaires", "batterie domestique", "prime énergie", "audit PEB", "rénovation énergétique"],
    years_experience: 12,
    location: "Namur, Belgique",
    image: "/images/authors/sophie-claessens.webp",
    linkedin: "https://www.linkedin.com/in/sophie-claessens-satyvo",
    niches: ["solar", "insulation", "heatpump", "renovation", "battery", "smartgrid", "subsidy", "prosumer"],
  },
  {
    slug: "thomas-vandenberghe",
    name: "Thomas Vandenberghe",
    role: {
      fr: "Analyste immobilier & spécialiste jumeau numérique",
      nl: "Vastgoedanalist & digital twin specialist",
      en: "Real estate analyst & digital twin specialist",
      de: "Immobilienanalyst & Digital-Twin-Spezialist",
      lb: "Immobilienanalyst & Digital-Twin-Spezialist",
    },
    bio: {
      fr: "Analyste immobilier à Bruxelles (KUL Master + 10 ans ImmoAnalyse.be), Thomas allie data science et expertise du marché belge. Référent sur jumeau numérique résidentiel, évaluation PEB et valorisation post-rénovation.",
      nl: "Vastgoedanalist in Brussel (KUL Master + 10 jaar ImmoAnalyse.be), Thomas combineert data science met expertise van de Belgische markt. Referent voor digitale tweelingen, EPC-evaluatie en waardestijging na renovatie.",
      en: "Real estate analyst in Brussels (KUL Master + 10 years ImmoAnalyse.be), Thomas combines data science with Belgian market expertise. Reference on residential digital twins, EPC evaluation and post-renovation valuation.",
      de: "Immobilienanalyst in Brüssel (KUL Master + 10 Jahre ImmoAnalyse.be), Thomas verbindet Data Science mit belgischer Marktexpertise. Referenz für Wohngebäude-Digital-Twins, EPC-Bewertung und Wertsteigerung nach Sanierung.",
      lb: "Immobilienanalyst zu Bréissel (KUL Master + 10 Joer ImmoAnalyse.be), den Thomas verbënnt Data Science mat belscher Marktexpertis. Referenz fir residentiell digital Twins, EPC-Bewäertung an Opwäertung no der Renovatioun.",
    },
    expertise: ["immobilier", "jumeau numérique", "évaluation PEB", "valorisation rénovation", "smart home", "IoT résidentiel"],
    years_experience: 10,
    location: "Bruxelles, Belgique",
    image: "/images/authors/thomas-vandenberghe.webp",
    linkedin: "https://www.linkedin.com/in/thomas-vandenberghe-satyvo",
    niches: ["digital", "prosumer", "smartgrid"],
  },
  {
    slug: "nathalie-peeters",
    name: "Nathalie Peeters",
    role: {
      fr: "Journaliste habitat durable & communicante bilingue",
      nl: "Journaliste duurzaam wonen & tweetalige redactrice",
      en: "Sustainable housing journalist & bilingual editor",
      de: "Journalistin für nachhaltiges Wohnen & zweisprachige Redakteurin",
      lb: "Journalistin fir nohalteg Wunnen & zweesproocheg Redakteurin",
    },
    bio: {
      fr: "Journaliste spécialisée (Bruges, 8 ans), Nathalie couvre l'actualité de la transition énergétique au Benelux. Spécialiste des enjeux politiques, des aides régionales et de la communication multilingue FR/NL/EN.",
      nl: "Gespecialiseerd journalist (Brugge, 8 jaar), Nathalie volgt het nieuws over de energietransitie in de Benelux. Specialist in beleidskwesties, regionale steun en meertalige communicatie NL/FR/EN.",
      en: "Specialised journalist (Bruges, 8 years), Nathalie covers Benelux energy transition news. Expert in policy issues, regional subsidies and multilingual NL/FR/EN communication.",
      de: "Fachjournalistin (Brügge, 8 Jahre), Nathalie berichtet über die Energiewende in den Benelux-Ländern. Expertin für Politik, regionale Förderungen und mehrsprachige Kommunikation.",
      lb: "Fachjournalistin (Bréigge, 8 Joer), d'Nathalie bericht iwwer d'Energietransitioun an de Benelux-Länner. Expertin fir Politik, regional Subsiden a méisproocheg Kommunikatioun.",
    },
    expertise: ["actualité énergie", "politique climat", "primes régionales", "communication multilingue", "rédaction SEO"],
    years_experience: 8,
    location: "Bruges, Belgique",
    image: "/images/authors/nathalie-peeters.webp",
    linkedin: "https://www.linkedin.com/in/nathalie-peeters-satyvo",
    niches: ["subsidy", "renovation"],
  },
];

/**
 * Retourne l'auteur adapté à une niche/catégorie d'article.
 * Fallback vers Sophie (niches énergie) si la catégorie n'est pas mappée.
 */
export function getAuthorForCategory(category: string): Author {
  const match = authors.find((a) => a.niches.includes(category));
  return match || authors[1]; // Sophie par défaut
}

/** Lookup auteur par slug. */
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
