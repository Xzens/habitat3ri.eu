/**
 * Bobex type.id mapping — complete B2C + Insurance + B2B categories.
 * Source: E:\Synergy\API BOBEX TYPE.id.xlsx (verified April 2026)
 *
 * BE/LU: affiliate 110451 via bobex.be
 * NL:    affiliate 110495 via bobex.nl
 */

export type BobexCategory = {
  id: string;
  typeId: number;
  label: { fr: string; nl: string; en: string; de: string; lb: string };
  group: "renovation" | "energy" | "security" | "insurance" | "garden" | "interior" | "other";
};

export const bobexCategories: BobexCategory[] = [
  // === ÉNERGIE ===
  { id: "panneaux-solaires", typeId: 11364, label: { fr: "Panneaux solaires", nl: "Zonnepanelen", en: "Solar panels", de: "Solaranlagen", lb: "Solarpanneauen" }, group: "energy" },
  { id: "pompe-a-chaleur", typeId: 11428, label: { fr: "Pompe à chaleur", nl: "Warmtepomp", en: "Heat pump", de: "Wärmepumpe", lb: "Wärmepompel" }, group: "energy" },
  { id: "batterie-domestique", typeId: 100053, label: { fr: "Batterie domestique", nl: "Thuisbatterij", en: "Home battery", de: "Hausbatterie", lb: "Hausbatterie" }, group: "energy" },
  { id: "chaudiere-condensation", typeId: 11426, label: { fr: "Chaudière à condensation", nl: "Condensatieketel", en: "Condensing boiler", de: "Brennwertkessel", lb: "Brennwäertkessel" }, group: "energy" },
  { id: "chauffe-eau-thermo", typeId: 100041, label: { fr: "Chauffe-eau thermodynamique", nl: "Warmtepompboiler", en: "Heat pump water heater", de: "Wärmepumpen-Boiler", lb: "Thermodynamesch Waasserheizer" }, group: "energy" },
  { id: "chauffe-eau-solaire", typeId: 30044, label: { fr: "Chauffe-eau solaire", nl: "Zonneboiler", en: "Solar water heater", de: "Solarthermie", lb: "Sonnewaasserheizer" }, group: "energy" },
  { id: "borne-recharge", typeId: 100061, label: { fr: "Borne de recharge", nl: "Laadpaal", en: "EV charging station", de: "Ladestation", lb: "Luedstatioun" }, group: "energy" },
  { id: "ventilation", typeId: 11453, label: { fr: "Système de ventilation", nl: "Ventilatiesysteem", en: "Ventilation system", de: "Lüftungsanlage", lb: "Ventilatiounssystem" }, group: "energy" },
  { id: "poele-pellets", typeId: 11969, label: { fr: "Poêle à pellets", nl: "Pelletkachel", en: "Pellet stove", de: "Pelletofen", lb: "Pelletuewen" }, group: "energy" },
  { id: "chauffage-infrarouge", typeId: 100063, label: { fr: "Chauffage infrarouge", nl: "Infraroodverwarming", en: "Infrared heating", de: "Infrarotheizung", lb: "Infraroutheizung" }, group: "energy" },

  // === ISOLATION ===
  { id: "isolation", typeId: 11427, label: { fr: "Isolation (générale)", nl: "Isolatie (algemeen)", en: "Insulation (general)", de: "Dämmung (allgemein)", lb: "Isolatioun (allgemeng)" }, group: "renovation" },
  { id: "isolation-toit", typeId: 30002, label: { fr: "Isolation du toit", nl: "Dakisolatie", en: "Roof insulation", de: "Dachdämmung", lb: "Dachisolatioun" }, group: "renovation" },
  { id: "isolation-murs-creux", typeId: 30003, label: { fr: "Isolation murs creux", nl: "Spouwmuurisolatie", en: "Cavity wall insulation", de: "Hohlwanddämmung", lb: "Spaltmauerisolatioun" }, group: "renovation" },
  { id: "isolation-murs-ext", typeId: 30056, label: { fr: "Isolation murs extérieurs", nl: "Buitenmuurisolatie", en: "External wall insulation", de: "Außenwanddämmung", lb: "Aussemauerisolatioun" }, group: "renovation" },
  { id: "isolation-sol", typeId: 30004, label: { fr: "Isolation du sol", nl: "Vloerisolatie", en: "Floor insulation", de: "Bodendämmung", lb: "Buedemisolatioun" }, group: "renovation" },
  { id: "chassis", typeId: 11452, label: { fr: "Châssis, portes et fenêtres", nl: "Ramen en deuren", en: "Windows and doors", de: "Fenster und Türen", lb: "Fënsteren an Dieren" }, group: "renovation" },

  // === TOITURE & FAÇADE ===
  { id: "toiture", typeId: 11962, label: { fr: "Travaux de toiture", nl: "Dakwerken", en: "Roofing works", de: "Dacharbeiten", lb: "Dachaarbechten" }, group: "renovation" },
  { id: "facade", typeId: 11986, label: { fr: "Rénovation de façades", nl: "Gevelrenovatie", en: "Facade renovation", de: "Fassadensanierung", lb: "Fassaderenovatioun" }, group: "renovation" },
  { id: "demoussage", typeId: 11992, label: { fr: "Démoussage toitures", nl: "Ontmossen dak", en: "Roof moss removal", de: "Dachenmoosen", lb: "Dachenmoosen" }, group: "renovation" },

  // === RÉNOVATION INTÉRIEURE ===
  { id: "cuisine", typeId: 100001, label: { fr: "Rénovation cuisine", nl: "Keukenrenovatie", en: "Kitchen renovation", de: "Küchenrenovierung", lb: "Kichenrenovatioun" }, group: "interior" },
  { id: "salle-de-bain", typeId: 11995, label: { fr: "Rénovation salle de bain", nl: "Badkamerrenovatie", en: "Bathroom renovation", de: "Badsanierung", lb: "Buedzëmmerrenovatioun" }, group: "interior" },
  { id: "renovation-interieure", typeId: 12008, label: { fr: "Rénovation intérieure", nl: "Interieur renovatie", en: "Interior renovation", de: "Innenrenovierung", lb: "Innenanrenovatioun" }, group: "interior" },
  { id: "peinture", typeId: 11996, label: { fr: "Travaux de peinture", nl: "Schilderwerken", en: "Painting works", de: "Malerarbeiten", lb: "Mooleraarbechten" }, group: "interior" },
  { id: "electricite", typeId: 12009, label: { fr: "Travaux d'électricité", nl: "Elektriciteitswerken", en: "Electrical works", de: "Elektroarbeiten", lb: "Elektricitéitsaarbechten" }, group: "interior" },
  { id: "plomberie", typeId: 100082, label: { fr: "Plomberie", nl: "Loodgieterij", en: "Plumbing", de: "Klempnerarbeit", lb: "Klempneraarbecht" }, group: "interior" },

  // === EXTENSION & GROS ŒUVRE ===
  { id: "extension", typeId: 12007, label: { fr: "Extension, rénovation maison", nl: "Uitbreiding, renovatie", en: "Home extension", de: "Anbau, Renovierung", lb: "Ausbau, Renovatioun" }, group: "renovation" },
  { id: "maconnerie", typeId: 100043, label: { fr: "Maçonnerie", nl: "Metselwerk", en: "Masonry", de: "Maurerarbeiten", lb: "Maureraarbechten" }, group: "renovation" },
  { id: "renovation-totale", typeId: 12005, label: { fr: "Rénovation totale", nl: "Totale renovatie", en: "Full renovation", de: "Totalrenovierung", lb: "Totalrenovatioun" }, group: "renovation" },

  // === JARDIN & EXTÉRIEUR ===
  { id: "veranda", typeId: 30163, label: { fr: "Véranda", nl: "Veranda", en: "Conservatory", de: "Wintergarten", lb: "Veranda" }, group: "garden" },
  { id: "pergola", typeId: 30164, label: { fr: "Pergola", nl: "Pergola", en: "Pergola", de: "Pergola", lb: "Pergola" }, group: "garden" },
  { id: "carport", typeId: 30165, label: { fr: "Carport", nl: "Carport", en: "Carport", de: "Carport", lb: "Carport" }, group: "garden" },
  { id: "piscine", typeId: 11983, label: { fr: "Piscine", nl: "Zwembad", en: "Swimming pool", de: "Schwimmbad", lb: "Schwämm" }, group: "garden" },
  { id: "terrasses", typeId: 100032, label: { fr: "Terrasses et allées", nl: "Terrassen en opritten", en: "Terraces and paths", de: "Terrassen und Wege", lb: "Terrassen an Weeër" }, group: "garden" },

  // === SÉCURITÉ ===
  { id: "alarme", typeId: 11406, label: { fr: "Système d'alarme", nl: "Alarmsysteem", en: "Alarm system", de: "Alarmsystem", lb: "Alarmsystem" }, group: "security" },
  { id: "adoucisseur", typeId: 11982, label: { fr: "Adoucisseur d'eau", nl: "Waterontharder", en: "Water softener", de: "Wasserenthärter", lb: "Waasserenthäerter" }, group: "other" },
  { id: "humidite", typeId: 11461, label: { fr: "Traitement de l'humidité", nl: "Vochtbestrijding", en: "Damp treatment", de: "Feuchtigkeitsbehandlung", lb: "Fiichtegkeetsbehandlung" }, group: "other" },
  { id: "audit-logement", typeId: 11973, label: { fr: "Audit logement / PEB", nl: "Woningaudit / EPC", en: "Energy audit / EPC", de: "Energieaudit", lb: "Energieaudit" }, group: "energy" },

  // === ASSURANCES ===
  { id: "assurance-auto", typeId: 10137, label: { fr: "Assurance voiture", nl: "Autoverzekering", en: "Car insurance", de: "Autoversicherung", lb: "Autoversécherung" }, group: "insurance" },
  { id: "assurance-habitation", typeId: 10138, label: { fr: "Assurance incendie et vol", nl: "Brand- en diefstalverzekering", en: "Fire and theft insurance", de: "Feuer- und Diebstahlversicherung", lb: "Feier- a Déifstallversécherung" }, group: "insurance" },
  { id: "assurance-familiale", typeId: 10139, label: { fr: "Assurance familiale", nl: "Familiale verzekering", en: "Family insurance", de: "Familienversicherung", lb: "Familljeveréscherung" }, group: "insurance" },
  { id: "assurance-hospitalisation", typeId: 100113, label: { fr: "Assurance hospitalisation", nl: "Hospitalisatieverzekering", en: "Hospitalisation insurance", de: "Krankenhausversicherung", lb: "Spidolversécherung" }, group: "insurance" },
  { id: "mutuelle", typeId: 100073, label: { fr: "Mutuelle", nl: "Mutualiteit", en: "Health insurance", de: "Krankenkasse", lb: "Krankekeess" }, group: "insurance" },
];

export const bobexGroupLabels: Record<string, Record<string, string>> = {
  energy: { fr: "Énergie & Chauffage", nl: "Energie & Verwarming", en: "Energy & Heating", de: "Energie & Heizung", lb: "Energie & Heizung" },
  renovation: { fr: "Isolation & Rénovation", nl: "Isolatie & Renovatie", en: "Insulation & Renovation", de: "Dämmung & Renovierung", lb: "Isolatioun & Renovatioun" },
  interior: { fr: "Intérieur & Finitions", nl: "Interieur & Afwerking", en: "Interior & Finishings", de: "Innenausbau", lb: "Innenanausbau" },
  garden: { fr: "Jardin & Extérieur", nl: "Tuin & Buiten", en: "Garden & Outdoor", de: "Garten & Außen", lb: "Gaart & Baussen" },
  security: { fr: "Sécurité", nl: "Beveiliging", en: "Security", de: "Sicherheit", lb: "Sécherheet" },
  insurance: { fr: "Assurances", nl: "Verzekeringen", en: "Insurance", de: "Versicherungen", lb: "Versécherungen" },
  other: { fr: "Autres", nl: "Andere", en: "Other", de: "Sonstiges", lb: "Anerer" },
};

/** Bobex API config per country */
export const bobexConfig: Record<string, { affiliateId: string; apiUrl: string; country: string }> = {
  BE: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld", country: "BE" },
  NL: { affiliateId: "110495", apiUrl: "https://www.bobex.nl/bobexnl/control/partner_concours_withheld", country: "NL" },
  LU: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld", country: "LU" },
  FR: { affiliateId: "110451", apiUrl: "https://www.bobex.be/control/partner_concours_withheld", country: "FR" },
};
