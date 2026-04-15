import type { Article } from "@/lib/supabase";

export const sampleArticles: Article[] = [
  // === ARTICLE 1 — FR ===
  {
    id: "1",
    slug: "panneaux-solaires-2026-guide-complet-belgique",
    locale: "fr",
    title: "Panneaux Solaires en 2026 : Le Guide Complet pour la Belgique",
    excerpt:
      "Tout ce que vous devez savoir sur l'installation de panneaux solaires en Belgique en 2026 : primes, rendement, tarif prosumer et retour sur investissement.",
    cover_image: "/images/blog/solar-panels-belgium.jpg",
    in_brief:
      "En 2026, installer des panneaux solaires en Belgique reste l'un des investissements les plus rentables pour les propriétaires. Avec les nouvelles primes régionales, un système de 10 kWc coûte entre 8 000 et 12 000 euros après aides, et le retour sur investissement se situe entre 5 et 7 ans. Le tarif prosumer évolue, mais l'autoconsommation et le stockage par batterie rendent le solaire plus attractif que jamais.",
    content: `## Pourquoi investir dans le solaire en 2026 ?

L'énergie solaire résidentielle connaît une croissance sans précédent en Belgique. Avec la hausse continue des prix de l'électricité (+35% depuis 2022) et les objectifs climatiques européens ambitieux, **transformer son toit en mini-centrale électrique** n'est plus un luxe mais une nécessité économique.

### Le contexte belge favorable

La Belgique, malgré sa réputation de pays pluvieux, bénéficie de **900 à 1 100 heures d'ensoleillement efficace** par an, suffisant pour rentabiliser une installation solaire. Le cadre réglementaire 2026 renforce encore les incitations :

- **Prime Wallonne** : jusqu'à 1 500 EUR pour les installations résidentielles
- **Prime Bruxelloise** : certificats verts revalorisés à 3,20 EUR/MWh
- **Prime Flamande** : réduction d'impôt de 1 530 EUR pour les installations photovoltaïques

### Choisir la bonne installation

Le dimensionnement de votre installation dépend de plusieurs facteurs :

**Consommation annuelle** : Un ménage belge moyen consomme entre 3 500 et 5 000 kWh par an. Un système de **10 panneaux (4 kWc)** couvre environ 80% de cette consommation.

**Orientation du toit** : L'orientation plein sud avec une inclinaison de 35° est idéale, mais les orientations est-ouest restent rentables avec seulement 10-15% de perte de rendement.

**Technologies 2026** : Les panneaux bifaciaux et les cellules TOPCon atteignent désormais des rendements de **22 à 24%**, contre 18% pour les panneaux standards d'il y a 5 ans.

### Le tarif prosumer : ce qui change en 2026

En Wallonie, le tarif prosumer est désormais calculé sur base de la puissance installée et non plus du compteur. **L'autoconsommation maximisée** devient la stratégie gagnante :

1. Programmez vos appareils énergivores pendant les heures de production
2. Investissez dans une batterie domestique (voir notre guide dédié)
3. Utilisez un système de gestion énergétique intelligent

### Le couplage solaire + batterie

En 2026, le prix des batteries domestiques a chuté de 40% par rapport à 2023. Un **système de stockage de 10 kWh** coûte désormais entre 4 000 et 6 000 EUR, permettant de porter votre taux d'autoconsommation de 30% à plus de 70%.

## Conclusion

Le solaire en 2026 est un investissement sûr, rentable et écologique. Avec un retour sur investissement de 5 à 7 ans et une durée de vie de 30+ ans, chaque propriétaire belge devrait sérieusement considérer cette option.`,
    key_info: [
      { label: "Coût moyen installation 10 kWc", value: "8 000 - 12 000 EUR (après primes)" },
      { label: "Retour sur investissement", value: "5 à 7 ans" },
      { label: "Durée de vie des panneaux", value: "30+ ans" },
      { label: "Rendement panneaux 2026", value: "22-24% (TOPCon/bifaciaux)" },
      { label: "Prime Wallonne max.", value: "1 500 EUR" },
      { label: "Autoconsommation avec batterie", value: "> 70%" },
    ],
    quotes: [
      "\"La Troisième Révolution Industrielle transformera chaque bâtiment en mini-centrale électrique.\" — Jeremy Rifkin",
      "\"Le solaire est désormais la source d'électricité la moins chère de l'histoire.\" — Agence Internationale de l'Énergie (AIE)",
      "\"En 2030, chaque propriétaire sera un prosumer.\" — Commission Européenne, Green Deal 2.0",
    ],
    faq: [
      {
        question: "Combien coûte une installation solaire en Belgique en 2026 ?",
        answer: "Une installation standard de 10 panneaux (4 kWc) coûte entre 5 000 et 7 000 EUR avant primes. Après les primes régionales, comptez entre 3 500 et 5 500 EUR.",
      },
      {
        question: "Les panneaux solaires fonctionnent-ils en Belgique avec la météo ?",
        answer: "Oui ! La Belgique bénéficie de 900 à 1 100 heures d'ensoleillement efficace par an. Les panneaux modernes produisent même par temps couvert grâce aux cellules à haut rendement.",
      },
      {
        question: "Quel est le retour sur investissement en 2026 ?",
        answer: "Avec les prix actuels de l'électricité et les primes, le retour sur investissement est de 5 à 7 ans. L'installation reste ensuite rentable pendant 23+ années supplémentaires.",
      },
      {
        question: "Dois-je coupler mes panneaux avec une batterie ?",
        answer: "Ce n'est pas obligatoire, mais fortement recommandé. Une batterie de 10 kWh augmente votre autoconsommation de 30% à 70%, maximisant vos économies.",
      },
      {
        question: "Qu'est-ce que le tarif prosumer ?",
        answer: "Le tarif prosumer est une redevance pour l'utilisation du réseau de distribution. En 2026, il est calculé sur base de la puissance installée. L'autoconsommation reste la meilleure stratégie.",
      },
      {
        question: "Puis-je installer des panneaux sur un toit plat ?",
        answer: "Absolument. Des structures d'inclinaison permettent d'optimiser l'angle à 35°. Les panneaux bifaciaux sont particulièrement adaptés aux toits plats.",
      },
    ],
    internal_links: [
      { title: "Panneaux Solaires & Batterie Belgique", url: "https://panneauxsolaires-batterie.be" },
      { title: "Pompe à Chaleur & Isolation", url: "https://pompeachaleur-isolation.be" },
      { title: "Trouvez un installateur certifié", url: "https://lesprosdemaville.be" },
      { title: "Assurance habitation pour maison rénovée", url: "https://assurance-habitation-incendie.be" },
    ],
    external_sources: [
      { title: "Rapport annuel photovoltaïque 2025", url: "https://www.iea.org", author: "Agence Internationale de l'Énergie" },
      { title: "Primes énergie en Wallonie 2026", url: "https://energie.wallonie.be", author: "SPW Énergie" },
      { title: "The Third Industrial Revolution", url: "https://www.foet.org", author: "Jeremy Rifkin Foundation" },
    ],
    youtube_url: "https://www.youtube.com/embed/QX3M8Ka9vUA",
    category: "solar",
    tags: ["panneaux solaires", "photovoltaïque", "belgique", "primes", "prosumer"],
    seo_keywords: ["panneaux solaires belgique 2026", "prix panneaux solaires 2026", "prime solaire wallonie", "installation solaire belgique"],
    reading_time: 8,
    status: "published",
    published_at: "2026-04-15T06:00:00Z",
    scheduled_at: null,
    created_at: "2026-04-10T10:00:00Z",
    updated_at: "2026-04-15T06:00:00Z",
  },

  // === ARTICLE 2 — FR ===
  {
    id: "2",
    slug: "pompe-a-chaleur-air-eau-guide-2026",
    locale: "fr",
    title: "Pompe à Chaleur Air-Eau : Tout Savoir pour Votre Maison en 2026",
    excerpt:
      "Guide complet sur les pompes à chaleur air-eau en 2026 : fonctionnement, coûts, primes, COP et conseils d'installation pour le Benelux.",
    cover_image: "/images/blog/heat-pump-house.jpg",
    in_brief:
      "La pompe à chaleur air-eau est devenue le système de chauffage de référence en 2026. Avec un COP moyen de 4,5, elle produit 4,5 kWh de chaleur pour 1 kWh d'électricité consommé. Combinée aux panneaux solaires, elle réduit la facture énergétique de 60 à 75%. Les primes peuvent couvrir jusqu'à 40% du coût d'installation.",
    content: `## La pompe à chaleur : pilier de la maison 3RI

Dans le cadre de la Troisième Révolution Industrielle, la pompe à chaleur air-eau joue un rôle central. Elle permet de **décarboner le chauffage** tout en réduisant drastiquement la consommation énergétique de votre habitation.

### Comment fonctionne une PAC air-eau ?

Le principe est simple mais ingénieux : la pompe à chaleur **capte les calories présentes dans l'air extérieur** (même à -15°C) et les transfère à votre circuit de chauffage central et/ou votre eau chaude sanitaire.

Le **COP (Coefficient de Performance)** mesure l'efficacité : un COP de 4,5 signifie que pour 1 kWh d'électricité consommé, la PAC produit **4,5 kWh de chaleur**. C'est 3 à 4 fois plus efficace qu'une chaudière à gaz.

### Les avancées 2026

- **Fluides réfrigérants R290 (propane)** : GWP de 3 vs 750 pour le R410A, conforme à la réglementation F-Gas
- **COP amélioré** : les modèles premium atteignent un COP de 5,2 en conditions optimales
- **Mode rafraîchissement** : la plupart des PAC 2026 offrent aussi le refroidissement passif en été
- **Connectivité IoT** : pilotage intelligent via smartphone et intégration smart grid

### Coûts et primes en Belgique

| Poste | Coût indicatif |
|-------|---------------|
| PAC air-eau 8-12 kW | 8 000 - 14 000 EUR |
| Installation complète | 3 000 - 5 000 EUR |
| Prime Wallonne | jusqu'à 3 000 EUR |
| Prime Bruxelloise | jusqu'à 4 500 EUR |
| **Coût net après primes** | **4 500 - 11 500 EUR** |

### Le couplage optimal PAC + Solaire

La combinaison panneaux solaires + pompe à chaleur est le **duo gagnant** de la rénovation énergétique 2026. L'électricité produite par vos panneaux alimente directement votre PAC, créant un cercle vertueux d'énergie propre et gratuite.

## Conclusion

La pompe à chaleur air-eau est un investissement stratégique pour toute habitation visant l'autonomie énergétique. Avec les primes 2026 et le couplage solaire, le retour sur investissement est atteint en 6 à 8 ans.`,
    key_info: [
      { label: "COP moyen 2026", value: "4,5 (jusqu'à 5,2 premium)" },
      { label: "Économies sur facture chauffage", value: "60 à 75%" },
      { label: "Coût installation complète", value: "11 000 - 19 000 EUR" },
      { label: "Prime Wallonne max.", value: "3 000 EUR" },
      { label: "Prime Bruxelloise max.", value: "4 500 EUR" },
      { label: "Durée de vie moyenne", value: "15-20 ans" },
    ],
    quotes: [
      "\"Les pompes à chaleur sont la technologie clé pour décarboner le chauffage en Europe.\" — Agence Européenne de l'Environnement",
      "\"Chaque bâtiment doit devenir un nœud du réseau énergétique distribué.\" — Jeremy Rifkin",
      "\"D'ici 2030, 50% des systèmes de chauffage au Benelux seront des pompes à chaleur.\" — Euroheat & Power",
    ],
    faq: [
      {
        question: "Une PAC fonctionne-t-elle quand il fait très froid ?",
        answer: "Oui, les PAC modernes fonctionnent efficacement jusqu'à -20°C. Le COP diminue avec le froid, mais reste supérieur à un chauffage électrique classique.",
      },
      {
        question: "Quel est le niveau sonore d'une PAC ?",
        answer: "Les modèles 2026 émettent entre 35 et 45 dB(A) à 3 mètres, comparable au bruit d'une bibliothèque. Les modèles premium sont encore plus silencieux.",
      },
      {
        question: "Faut-il isoler sa maison avant d'installer une PAC ?",
        answer: "C'est fortement recommandé. Une bonne isolation permet de dimensionner une PAC plus petite et d'optimiser son COP. L'isolation du toit et des murs est prioritaire.",
      },
      {
        question: "Peut-on coupler une PAC avec un chauffage au sol existant ?",
        answer: "C'est même la combinaison idéale ! Le chauffage au sol fonctionne à basse température (35°C), ce qui maximise le COP de la pompe à chaleur.",
      },
      {
        question: "Quelle est la durée de vie d'une PAC air-eau ?",
        answer: "15 à 20 ans avec un entretien régulier (contrôle annuel recommandé). Le compresseur est généralement garanti 5 à 10 ans.",
      },
    ],
    internal_links: [
      { title: "Pompe à Chaleur & Isolation Belgique", url: "https://pompeachaleur-isolation.be" },
      { title: "Panneaux Solaires & Batterie", url: "https://panneauxsolaires-batterie.be" },
      { title: "Isolation de toiture et façades", url: "https://toiture-facades-renov.be" },
      { title: "Trouvez un installateur certifié", url: "https://lesprosdemaville.be" },
    ],
    external_sources: [
      { title: "Rapport pompes à chaleur en Europe 2025", url: "https://www.ehpa.org", author: "European Heat Pump Association" },
      { title: "Réglementation F-Gas 2025", url: "https://ec.europa.eu", author: "Commission Européenne" },
    ],
    youtube_url: "https://www.youtube.com/embed/7J52mDjZzto",
    category: "heatpump",
    tags: ["pompe à chaleur", "chauffage", "PAC air-eau", "COP", "primes"],
    seo_keywords: ["pompe a chaleur air eau 2026", "prix PAC belgique", "prime pompe a chaleur wallonie", "COP pompe a chaleur"],
    reading_time: 7,
    status: "published",
    published_at: "2026-04-13T06:00:00Z",
    scheduled_at: null,
    created_at: "2026-04-08T10:00:00Z",
    updated_at: "2026-04-13T06:00:00Z",
  },

  // === ARTICLE 3 — FR ===
  {
    id: "3",
    slug: "maison-prosumer-2026-devenir-producteur-energie",
    locale: "fr",
    title: "Devenir Prosumer en 2026 : Transformez Votre Maison en Producteur d'Énergie",
    excerpt:
      "Comment devenir prosumer en Belgique : le guide pour transformer votre habitation en mini-centrale électrique autonome.",
    cover_image: "/images/blog/prosumer-home.jpg",
    in_brief:
      "Le concept de prosumer — producteur et consommateur d'énergie — est au cœur de la Troisième Révolution Industrielle. En 2026, devenir prosumer en Belgique implique l'installation de panneaux solaires, d'une batterie de stockage et d'un système de gestion énergétique intelligent. L'objectif : autoconsommer 70 à 90% de sa production et réinjecter le surplus dans le réseau.",
    content: `## Qu'est-ce qu'un prosumer ?

Le terme **prosumer** combine "producteur" et "consommateur". C'est le pilier n°2 de la Troisième Révolution Industrielle de Jeremy Rifkin : **chaque bâtiment devient sa propre mini-centrale électrique**.

### Les composants d'une maison prosumer

Une maison prosumer complète en 2026 comprend :

1. **Panneaux solaires photovoltaïques** (4-10 kWc) — production d'électricité
2. **Batterie domestique** (5-15 kWh) — stockage de l'excédent
3. **Pompe à chaleur** — chauffage et refroidissement efficaces
4. **Système de gestion énergétique (EMS)** — optimisation automatique
5. **Compteur intelligent** — mesure bidirectionnelle de l'énergie
6. **Borne de recharge véhicule électrique** (optionnel) — mobilité verte

### Le jumeau numérique de votre maison

Une innovation majeure de 2026 est le **jumeau numérique** (digital twin) de votre habitation. Grâce à la modélisation 3D et aux capteurs IoT, vous visualisez en temps réel :

- Les flux d'énergie dans votre maison
- La production solaire prédictive
- Les opportunités d'optimisation
- Les scénarios de rénovation et leur impact

### ROI d'une transformation prosumer complète

Le pack complet (solaire + batterie + PAC + EMS) représente un investissement de **25 000 à 45 000 EUR** après primes. Avec des économies annuelles de 3 000 à 5 000 EUR, le retour sur investissement se situe entre **7 et 10 ans**, après quoi votre énergie est pratiquement gratuite.

## L'avenir : le prosumer dans le smart grid

Le prosumer de demain ne sera pas isolé. Grâce à **l'Internet de l'Énergie** (pilier n°4 de Rifkin), chaque maison prosumer sera connectée au réseau intelligent, échangeant son énergie excédentaire avec ses voisins, son quartier et au-delà.`,
    key_info: [
      { label: "Investissement pack complet", value: "25 000 - 45 000 EUR (après primes)" },
      { label: "Économies annuelles", value: "3 000 - 5 000 EUR" },
      { label: "Taux d'autoconsommation cible", value: "70 - 90%" },
      { label: "ROI pack complet", value: "7 à 10 ans" },
      { label: "Réduction empreinte carbone", value: "60 - 80%" },
      { label: "Durée de vie du système", value: "25+ ans" },
    ],
    quotes: [
      "\"Chaque bâtiment sera une micro-centrale d'énergie renouvelable dans la Troisième Révolution Industrielle.\" — Jeremy Rifkin, The Green New Deal",
      "\"Le prosumer est le citoyen énergétique du 21ème siècle.\" — Commission Européenne",
      "\"L'autonomie énergétique résidentielle n'est plus un rêve, c'est un calcul économique.\" — Solar Power Europe",
    ],
    faq: [
      {
        question: "Combien coûte une transformation prosumer complète ?",
        answer: "Le pack solaire + batterie + PAC + gestion intelligente coûte entre 25 000 et 45 000 EUR après primes, selon la taille de votre habitation.",
      },
      {
        question: "Peut-on devenir prosumer dans un appartement ?",
        answer: "C'est plus difficile mais possible via les installations collectives. Les copropriétés peuvent installer des panneaux solaires partagés.",
      },
      {
        question: "Faut-il tout installer en une fois ?",
        answer: "Non ! L'approche par étapes est tout à fait viable. Commencez par le solaire, ajoutez une batterie, puis la PAC. Chaque étape apporte des bénéfices immédiats.",
      },
      {
        question: "Que se passe-t-il avec le surplus d'énergie ?",
        answer: "Le surplus peut être stocké dans votre batterie, réinjecté dans le réseau (compensation partielle), ou à terme échangé via des communautés d'énergie locales.",
      },
      {
        question: "Le jumeau numérique est-il indispensable ?",
        answer: "Pas indispensable mais très recommandé. Il optimise votre consommation de 15-25% supplémentaires et facilite les décisions de rénovation.",
      },
    ],
    internal_links: [
      { title: "Clone Numérique — Jumeau Digital", url: "https://clonenumerique.be" },
      { title: "Panneaux Solaires & Batterie", url: "https://panneauxsolaires-batterie.be" },
      { title: "Pompe à Chaleur & Isolation", url: "https://pompeachaleur-isolation.be" },
      { title: "Sécurité maison intelligente", url: "https://alarme-securite-maison.be" },
    ],
    external_sources: [
      { title: "The Third Industrial Revolution", url: "https://www.foet.org", author: "Jeremy Rifkin Foundation" },
      { title: "EU Prosumer Policy Framework 2025", url: "https://ec.europa.eu", author: "European Commission" },
      { title: "Digital Twins in Smart Buildings", url: "https://www.iea.org", author: "IEA Energy Technology" },
    ],
    category: "prosumer",
    tags: ["prosumer", "autoconsommation", "maison intelligente", "jumeau numérique", "3RI"],
    seo_keywords: ["maison prosumer belgique", "devenir prosumer 2026", "autoconsommation solaire", "mini centrale électrique maison"],
    reading_time: 9,
    status: "published",
    published_at: "2026-04-11T06:00:00Z",
    scheduled_at: null,
    created_at: "2026-04-06T10:00:00Z",
    updated_at: "2026-04-11T06:00:00Z",
  },

  // === ARTICLE 4 — NL ===
  {
    id: "4",
    slug: "zonnepanelen-2026-complete-gids-nederland-belgie",
    locale: "nl",
    title: "Zonnepanelen in 2026: De Complete Gids voor Nederland en België",
    excerpt:
      "Alles wat u moet weten over zonnepanelen in 2026: kosten, subsidies, rendement en terugverdientijd in Nederland en België.",
    cover_image: "/images/blog/solar-panels-netherlands.jpg",
    in_brief:
      "In 2026 blijven zonnepanelen een van de beste investeringen voor huiseigenaren in de Benelux. Met de nieuwste TOPCon-technologie bereiken panelen een rendement van 22-24%. De gemiddelde terugverdientijd is 5-7 jaar in België en 6-8 jaar in Nederland. Gecombineerd met een thuisbatterij stijgt het zelfverbruik van 30% naar meer dan 70%.",
    content: `## Waarom zonnepanelen in 2026?

Zonne-energie is nu de **goedkoopste bron van elektriciteit** ter wereld. Voor huiseigenaren in de Benelux betekent dit een unieke kans om hun energiekosten drastisch te verlagen en tegelijk bij te dragen aan de energietransitie.

### De technologie in 2026

De zonnepanelensector evolueert snel:

- **TOPCon-cellen**: 22-24% rendement, de nieuwe standaard
- **Bifaciale panelen**: produceren ook via gereflecteerd licht
- **Geïntegreerde micro-omvormers**: optimalisatie per paneel
- **Dunne-film PERC+**: geschikt voor complexe daken

### Kosten en subsidies

| Land | Installatie 10 panelen | Subsidie | Netto kosten |
|------|----------------------|---------|-------------|
| België (Wallonië) | 5 500 - 7 500 EUR | tot 1 500 EUR | 4 000 - 6 000 EUR |
| België (Vlaanderen) | 5 000 - 7 000 EUR | belastingvoordeel 1 530 EUR | 3 470 - 5 470 EUR |
| Nederland | 5 000 - 7 000 EUR | BTW 0% + ISDE | 4 000 - 6 000 EUR |

### Zelfverbruik maximaliseren

De sleutel tot maximale besparing is **zelfverbruik**. Zonder batterij verbruikt u slechts 25-35% van uw productie zelf. Met een **thuisbatterij van 10 kWh** stijgt dit naar 70-80%.

### De combinatie met warmtepomp

Zonnepanelen + warmtepomp = de **gouden combinatie** voor de Derde Industriële Revolutie. Uw zonnepanelen voeden uw warmtepomp, die op haar beurt uw woning verwarmt met een COP van 4,5 — dat is 4,5 keer efficiënter dan directe elektrische verwarming.

## Conclusie

Zonnepanelen zijn in 2026 een no-brainer voor elke huiseigenaar in de Benelux. Met dalende prijzen, stijgende rendementen en slimme opslagoplossingen is nu het moment om te investeren.`,
    key_info: [
      { label: "Gemiddelde kosten 10 panelen", value: "5 000 - 7 500 EUR" },
      { label: "Terugverdientijd", value: "5-8 jaar" },
      { label: "Rendement TOPCon 2026", value: "22-24%" },
      { label: "Levensduur panelen", value: "30+ jaar" },
      { label: "Zelfverbruik met batterij", value: "> 70%" },
      { label: "CO2-reductie per installatie", value: "2-3 ton/jaar" },
    ],
    quotes: [
      "\"De Derde Industriële Revolutie transformeert elk gebouw in een mini-energiecentrale.\" — Jeremy Rifkin",
      "\"Zonne-energie is nu de goedkoopste elektriciteitsbron in de geschiedenis.\" — Internationaal Energieagentschap (IEA)",
      "\"Nederland heeft de potentie om 40% van zijn elektriciteit uit zonne-energie op daken te halen.\" — TNO",
    ],
    faq: [
      {
        question: "Hoeveel kosten zonnepanelen in 2026?",
        answer: "Een standaardinstallatie van 10 panelen (4 kWc) kost tussen 5 000 en 7 500 EUR vóór subsidies. Na subsidies betaalt u netto 3 500 tot 6 000 EUR.",
      },
      {
        question: "Werken zonnepanelen in de Benelux?",
        answer: "Absoluut! De Benelux heeft 900-1 100 effectieve zonuren per jaar. Moderne panelen produceren zelfs bij bewolkt weer dankzij hoogrendementscellen.",
      },
      {
        question: "Wat is de terugverdientijd?",
        answer: "Gemiddeld 5-7 jaar in België en 6-8 jaar in Nederland. Daarna geniet u nog 22+ jaar van gratis energie.",
      },
      {
        question: "Is een thuisbatterij noodzakelijk?",
        answer: "Niet verplicht maar sterk aangeraden. Een batterij van 10 kWh verhoogt uw zelfverbruik van 30% naar 70+%, wat uw besparingen maximaliseert.",
      },
      {
        question: "Kan ik zonnepanelen op een plat dak plaatsen?",
        answer: "Ja, met ophogingsconstructies die de optimale hoek van 35° bieden. Bifaciale panelen zijn bijzonder geschikt voor platte daken.",
      },
    ],
    internal_links: [
      { title: "Zonnepaneel & Batterij Nederland", url: "https://zonnepaneel-batterij.nl" },
      { title: "Warmtepomp & Isolatie Nederland", url: "https://warmtepomp-isolatie.nl" },
      { title: "Vind een gecertificeerde installateur", url: "https://deprosvanmijnstad.nl" },
      { title: "Dak & Gevel Renovatie", url: "https://dak-gevel-renovatie.nl" },
    ],
    external_sources: [
      { title: "Jaarrapport zonne-energie 2025", url: "https://www.iea.org", author: "Internationaal Energieagentschap" },
      { title: "ISDE-subsidie 2026", url: "https://www.rvo.nl", author: "Rijksdienst voor Ondernemend Nederland" },
    ],
    youtube_url: "https://www.youtube.com/embed/QX3M8Ka9vUA",
    category: "solar",
    tags: ["zonnepanelen", "fotovoltaïsch", "nederland", "belgie", "subsidies"],
    seo_keywords: ["zonnepanelen 2026", "kosten zonnepanelen", "subsidie zonnepanelen nederland", "terugverdientijd zonnepanelen"],
    reading_time: 7,
    status: "published",
    published_at: "2026-04-14T06:00:00Z",
    scheduled_at: null,
    created_at: "2026-04-09T10:00:00Z",
    updated_at: "2026-04-14T06:00:00Z",
  },

  // === ARTICLE 5 — NL ===
  {
    id: "5",
    slug: "warmtepomp-isolatie-slimme-combinatie-2026",
    locale: "nl",
    title: "Warmtepomp + Isolatie: De Slimme Combinatie voor 2026",
    excerpt:
      "Hoe de combinatie van warmtepomp en isolatie uw energiefactuur met 70% verlaagt. Complete gids voor de Benelux.",
    cover_image: "/images/blog/heatpump-insulation.jpg",
    in_brief:
      "De combinatie warmtepomp + isolatie is de meest effectieve strategie voor energierenovatie in 2026. Eerst isoleren verlaagt uw warmtebehoefte met 40-60%, waarna een kleinere (en goedkopere) warmtepomp volstaat. Het resultaat: 70% lagere energiekosten en een comfortabeler woning het hele jaar door.",
    content: `## Waarom eerst isoleren, dan een warmtepomp?

De volgorde is cruciaal: **eerst isoleren, dan verwarmen**. Door uw woning goed te isoleren, vermindert u de warmtebehoefte drastisch. Dit betekent dat u een **kleinere en goedkopere warmtepomp** kunt installeren met een hoger rendement.

### De isolatie-prioriteiten

Niet alle isolatie is gelijk. De **return on investment** verschilt per maatregel:

1. **Dakisolatie** — ROI: 2-4 jaar, besparing: 25-30%
2. **Muurisolatie (spouwmuur)** — ROI: 3-5 jaar, besparing: 20-25%
3. **Vloerisolatie** — ROI: 5-8 jaar, besparing: 10-15%
4. **Hoogrendementsglas** — ROI: 8-12 jaar, besparing: 10-15%

### De juiste warmtepomp kiezen

Na isolatie kunt u uw warmtepomp optimaal dimensioneren:

- **Lucht-water warmtepomp**: meest populair, COP 4,0-5,2
- **Bodem-water warmtepomp**: hoogste COP (5,0-6,0) maar hogere installatie kosten
- **Hybride warmtepomp**: combineert warmtepomp met bestaande ketel

### Subsidies 2026 voor de combo

In België en Nederland zijn er **gecombineerde subsidies** voor isolatie + warmtepomp:

- **Wallonië**: tot 6 000 EUR voor het pakket isolatie + PAC
- **Vlaanderen**: Mijn VerbouwPremie tot 5 000 EUR
- **Nederland**: ISDE-subsidie tot 5 900 EUR voor warmtepomp + isolatie

## Conclusie

De combinatie isolatie + warmtepomp is de hoeksteen van elke energierenovatie. Begin met isolatie voor de grootste besparing en voeg dan een op maat gedimensioneerde warmtepomp toe.`,
    key_info: [
      { label: "Besparing door isolatie alleen", value: "40-60% warmtebehoefte" },
      { label: "Totale energiebesparing combo", value: "70%+" },
      { label: "ROI dakisolatie", value: "2-4 jaar" },
      { label: "COP lucht-water warmtepomp 2026", value: "4,0-5,2" },
      { label: "Subsidie Wallonië pakket", value: "tot 6 000 EUR" },
      { label: "ISDE Nederland", value: "tot 5 900 EUR" },
    ],
    quotes: [
      "\"De energie die je niet verbruikt, is de schoonste energie.\" — Amory Lovins, Rocky Mountain Institute",
      "\"Isolatie is de basis van elke duurzame renovatie.\" — Belgische Bouwunie",
      "\"De warmtepomp is de sleuteltechnologie voor de verwarming van de toekomst.\" — European Heat Pump Association",
    ],
    faq: [
      {
        question: "Moet ik eerst isoleren of eerst een warmtepomp plaatsen?",
        answer: "Altijd eerst isoleren! Goede isolatie verlaagt uw warmtebehoefte, zodat u een kleinere en efficiëntere warmtepomp kunt installeren.",
      },
      {
        question: "Hoeveel kost een volledige isolatie?",
        answer: "Dakisolatie: 2 000-5 000 EUR, muurisolatie: 3 000-8 000 EUR, vloerisolatie: 1 500-4 000 EUR. Na subsidies ligt het totaal tussen 4 000 en 12 000 EUR.",
      },
      {
        question: "Welke warmtepomp is het beste voor mijn woning?",
        answer: "Een lucht-water warmtepomp is het meest populair en betaalbaar. Bij nieuwbouw of grondige renovatie kan een bodemwarmtepomp voordeliger zijn op lange termijn.",
      },
      {
        question: "Kan ik de subsidies voor isolatie en warmtepomp combineren?",
        answer: "Ja! In alle regio's kunt u subsidies voor isolatie en warmtepomp combineren. Sommige regio's bieden zelfs een bonus voor het gecombineerde pakket.",
      },
      {
        question: "Hoe lang duurt de terugverdientijd van het totale pakket?",
        answer: "Het pakket isolatie + warmtepomp verdient zich gemiddeld in 6-10 jaar terug, afhankelijk van uw huidige energieverbruik en de gekozen maatregelen.",
      },
    ],
    internal_links: [
      { title: "Warmtepomp & Isolatie Nederland", url: "https://warmtepomp-isolatie.nl" },
      { title: "Dak & Gevel Renovatie", url: "https://dak-gevel-renovatie.nl" },
      { title: "Zonnepaneel & Batterij", url: "https://zonnepaneel-batterij.nl" },
      { title: "Vind een vakman", url: "https://deprosvanmijnstad.nl" },
    ],
    external_sources: [
      { title: "ISDE Subsidieregeling 2026", url: "https://www.rvo.nl", author: "RVO Nederland" },
      { title: "Mijn VerbouwPremie Vlaanderen", url: "https://www.vlaanderen.be", author: "Vlaamse Overheid" },
      { title: "Warmtepomp Marktrapport 2025", url: "https://www.ehpa.org", author: "European Heat Pump Association" },
    ],
    category: "insulation",
    tags: ["warmtepomp", "isolatie", "energierenovatie", "subsidies", "benelux"],
    seo_keywords: ["warmtepomp isolatie combinatie", "isolatie subsidie 2026", "warmtepomp kosten nederland", "energierenovatie benelux"],
    reading_time: 7,
    status: "published",
    published_at: "2026-04-12T06:00:00Z",
    scheduled_at: null,
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-12T06:00:00Z",
  },
];
