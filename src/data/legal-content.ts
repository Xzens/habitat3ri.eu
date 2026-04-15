/**
 * Legal content for Habitat3RI.eu — matching Constellation Satyvo SA pattern.
 * Company: Satyvo SA, BCE 0791.828.816, Belgian SA
 * Hosting: Vercel Inc. (for this site) + Hostinger (for constellation)
 */

export const legalContent: Record<string, {
  mentionsLegales: { title: string; sections: { heading: string; content: string }[] };
  confidentialite: { title: string; sections: { heading: string; content: string }[] };
}> = {
  fr: {
    mentionsLegales: {
      title: "Mentions légales",
      sections: [
        {
          heading: "1. Éditeur",
          content: `<strong>Habitat3RI.eu</strong> est un site web édité par :
<ul>
<li><strong>Raison sociale :</strong> Satyvo SA</li>
<li><strong>Forme juridique :</strong> Société anonyme de droit belge</li>
<li><strong>Numéro BCE :</strong> 0791.828.816</li>
<li><strong>TVA :</strong> BE0791828816</li>
<li><strong>Pays :</strong> Belgique</li>
<li><strong>E-mail :</strong> <a href="mailto:info@satyvo.be">info@satyvo.be</a></li>
<li><strong>Site web :</strong> <a href="https://habitat3ri.eu">habitat3ri.eu</a></li>
</ul>`,
        },
        {
          heading: "2. Hébergement",
          content: `<ul>
<li><strong>Société :</strong> Vercel Inc.</li>
<li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
<li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a></li>
</ul>
<p>Les données sont servies via le réseau CDN mondial de Vercel avec des points de présence au sein de l'Union européenne.</p>`,
        },
        {
          heading: "3. Propriété intellectuelle",
          content: `L'ensemble du contenu de ce site (textes, images, logos, structure) est la propriété de Satyvo SA ou est utilisé avec autorisation. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.`,
        },
        {
          heading: "4. Protection des données (RGPD)",
          content: `Vos données personnelles sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).
<ul>
<li><strong>Données collectées :</strong> nom, adresse e-mail, numéro de téléphone, code postal (via le formulaire de devis)</li>
<li><strong>Finalité :</strong> transmission à des professionnels vérifiés pour l'établissement de devis</li>
<li><strong>Durée de conservation :</strong> 30 jours maximum, puis suppression automatique</li>
<li><strong>Tiers :</strong> les données peuvent être partagées avec Bobex (mise en relation) et Google Analytics (anonymisé)</li>
</ul>
<p>Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Contactez-nous à <a href="mailto:info@satyvo.be">info@satyvo.be</a>.</p>
<p>Pour plus d'informations, consultez notre <a href="/confidentialite/">politique de confidentialité</a>.</p>`,
        },
        {
          heading: "5. Cookies",
          content: `Ce site utilise les cookies suivants :
<ul>
<li><strong>Cookies de session technique :</strong> nécessaires au fonctionnement du formulaire (protection CSRF). Aucun consentement requis.</li>
<li><strong>Google Analytics (GA4) :</strong> cookies analytiques pour mesurer les statistiques de fréquentation. Les adresses IP sont anonymisées. Chargé uniquement après consentement.</li>
</ul>
<p>Vous pouvez désactiver les cookies via les paramètres de votre navigateur ou via notre bannière de consentement.</p>`,
        },
        {
          heading: "6. Limitation de responsabilité",
          content: `Les informations présentées sur ce site sont fournies à titre indicatif et peuvent être modifiées à tout moment. Satyvo SA n'est pas responsable de l'exactitude ou de l'exhaustivité des informations fournies. Les indications de prix sont des estimations (±25-35%) et seul un devis professionnel fait foi.
<p>Satyvo SA n'est pas un intermédiaire au sens de la loi. Nous ne fournissons aucun conseil juridique, financier ou technique.</p>`,
        },
        {
          heading: "7. Droit applicable",
          content: `Ce site et les présentes mentions légales sont soumis au droit belge. Tout litige relève de la compétence des tribunaux de Belgique.`,
        },
      ],
    },
    confidentialite: {
      title: "Politique de confidentialité",
      sections: [
        {
          heading: "1. Responsable du traitement",
          content: `<strong>Satyvo SA</strong><br>BCE : 0791.828.816<br>E-mail : <a href="mailto:info@satyvo.be">info@satyvo.be</a>`,
        },
        {
          heading: "2. Données collectées",
          content: `Nous collectons les données suivantes via nos formulaires :
<ul>
<li>Nom et prénom</li>
<li>Adresse e-mail</li>
<li>Numéro de téléphone</li>
<li>Code postal</li>
<li>Type de projet/travaux souhaités</li>
<li>Description optionnelle du projet</li>
</ul>`,
        },
        {
          heading: "3. Finalités du traitement",
          content: `Vos données sont utilisées pour :
<ul>
<li>Vous mettre en relation avec des professionnels qualifiés via Bobex</li>
<li>Vous envoyer les devis demandés</li>
<li>Améliorer nos services (statistiques anonymisées via Google Analytics)</li>
</ul>
<p>Vos données ne sont <strong>jamais</strong> vendues à des tiers à des fins marketing.</p>`,
        },
        {
          heading: "4. Partage des données",
          content: `Vos données peuvent être partagées avec :
<ul>
<li><strong>Bobex.be / Bobex.nl :</strong> plateforme de mise en relation avec des professionnels (affilié n° 110451 BE / 110495 NL)</li>
<li><strong>Solteo :</strong> calculateur solaire (si vous utilisez le simulateur)</li>
<li><strong>Google Analytics :</strong> statistiques de fréquentation (données anonymisées, uniquement après consentement cookies)</li>
</ul>
<p>Les données ne sont <strong>pas</strong> partagées entre les différents sites de la constellation Satyvo SA.</p>`,
        },
        {
          heading: "5. Durée de conservation",
          content: `<ul>
<li><strong>Leads/devis :</strong> 30 jours maximum, puis suppression automatique</li>
<li><strong>Compte utilisateur (Deuxième Cerveau) :</strong> conservé tant que le compte est actif</li>
<li><strong>Cookies analytiques :</strong> 13 mois maximum (GA4)</li>
</ul>`,
        },
        {
          heading: "6. Vos droits",
          content: `Conformément au RGPD, vous disposez des droits suivants :
<ul>
<li>Droit d'accès à vos données</li>
<li>Droit de rectification</li>
<li>Droit à l'effacement (« droit à l'oubli »)</li>
<li>Droit à la portabilité des données</li>
<li>Droit d'opposition au traitement</li>
</ul>
<p>Pour exercer ces droits : <a href="mailto:info@satyvo.be">info@satyvo.be</a></p>
<p>En cas de réclamation, vous pouvez contacter l'Autorité de protection des données (APD) : <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener">autoriteprotectiondonnees.be</a></p>`,
        },
        {
          heading: "7. Sécurité",
          content: `Nous mettons en œuvre les mesures techniques suivantes :
<ul>
<li>HTTPS obligatoire sur toutes les pages</li>
<li>En-têtes de sécurité (CSP, HSTS, X-Frame-Options)</li>
<li>Protection CSRF sur les formulaires</li>
<li>Limitation de débit (rate limiting) sur les API</li>
<li>Données stockées au sein de l'UE (Supabase EU)</li>
</ul>`,
        },
      ],
    },
  },
  nl: {
    mentionsLegales: {
      title: "Juridische vermeldingen",
      sections: [
        { heading: "1. Uitgever", content: `<strong>Habitat3RI.eu</strong> is een website beheerd door:
<ul><li><strong>Bedrijfsnaam:</strong> Satyvo SA</li><li><strong>Rechtsvorm:</strong> Naamloze vennootschap naar Belgisch recht</li><li><strong>BCE-nummer:</strong> 0791.828.816</li><li><strong>BTW:</strong> BE0791828816</li><li><strong>Land:</strong> België</li><li><strong>E-mail:</strong> <a href="mailto:info@satyvo.be">info@satyvo.be</a></li><li><strong>Website:</strong> <a href="https://habitat3ri.eu">habitat3ri.eu</a></li></ul>` },
        { heading: "2. Hosting", content: `<ul><li><strong>Bedrijf:</strong> Vercel Inc.</li><li><strong>Adres:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li><li><strong>Website:</strong> <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a></li></ul><p>De gegevens worden verspreid via het wereldwijde CDN-netwerk van Vercel met aanwezigheidspunten binnen de Europese Unie.</p>` },
        { heading: "3. Intellectueel eigendom", content: `De volledige inhoud van deze website (teksten, afbeeldingen, logo's, structuur) is eigendom van Satyvo SA of wordt gebruikt met toestemming. Elke reproductie, geheel of gedeeltelijk, zonder voorafgaande schriftelijke toestemming is verboden.` },
        { heading: "4. Gegevensbescherming (AVG)", content: `Uw persoonsgegevens worden verwerkt in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).<ul><li><strong>Verzamelde gegevens:</strong> naam, e-mailadres, telefoonnummer, postcode (via het offerteformulier)</li><li><strong>Doel:</strong> doorverwijzing naar geverifieerde vakmensen voor het opstellen van offertes</li><li><strong>Bewaartermijn:</strong> maximaal 30 dagen, daarna automatisch verwijderd</li><li><strong>Derden:</strong> gegevens kunnen worden gedeeld met Bobex (offerte-matching) en Google Analytics (geanonimiseerd)</li></ul><p>U heeft het recht op inzage, rectificatie, verwijdering en overdraagbaarheid van uw gegevens. Neem contact op via <a href="mailto:info@satyvo.be">info@satyvo.be</a>.</p>` },
        { heading: "5. Cookies", content: `Deze website maakt gebruik van:<ul><li><strong>Technische sessiecookies:</strong> noodzakelijk voor de werking van het formulier (CSRF-bescherming). Geen toestemming vereist.</li><li><strong>Google Analytics (GA4):</strong> analytische cookies. IP-adressen worden geanonimiseerd. Alleen geladen na toestemming.</li></ul><p>U kunt cookies uitschakelen via de instellingen van uw browser of via onze toestemmingsbanner.</p>` },
        { heading: "6. Beperking van aansprakelijkheid", content: `De informatie op deze website is indicatief en kan op elk moment worden gewijzigd. Satyvo SA is niet verantwoordelijk voor de nauwkeurigheid of volledigheid van de verstrekte informatie. Prijsindicaties zijn schattingen (±25-35%) en alleen een professionele offerte is bindend.<p>Satyvo SA is geen tussenpersoon in de zin van de wet. Wij bieden geen juridisch, financieel of technisch advies.</p>` },
        { heading: "7. Toepasselijk recht", content: `Op deze website en deze juridische vermeldingen is het Belgisch recht van toepassing. Eventuele geschillen vallen onder de bevoegdheid van de rechtbanken van België.` },
      ],
    },
    confidentialite: {
      title: "Privacybeleid",
      sections: [
        { heading: "1. Verwerkingsverantwoordelijke", content: `<strong>Satyvo SA</strong><br>BCE: 0791.828.816<br>E-mail: <a href="mailto:info@satyvo.be">info@satyvo.be</a>` },
        { heading: "2. Verzamelde gegevens", content: `Wij verzamelen via onze formulieren:<ul><li>Voor- en achternaam</li><li>E-mailadres</li><li>Telefoonnummer</li><li>Postcode</li><li>Type project/gewenste werkzaamheden</li><li>Optionele projectbeschrijving</li></ul>` },
        { heading: "3. Doeleinden", content: `Uw gegevens worden gebruikt om:<ul><li>U in contact te brengen met gekwalificeerde vakmensen via Bobex</li><li>U de gevraagde offertes te sturen</li><li>Onze diensten te verbeteren (geanonimiseerde statistieken via Google Analytics)</li></ul><p>Uw gegevens worden <strong>nooit</strong> verkocht aan derden voor marketingdoeleinden.</p>` },
        { heading: "4. Delen van gegevens", content: `Uw gegevens kunnen worden gedeeld met:<ul><li><strong>Bobex.be / Bobex.nl:</strong> platform voor het matchen met vakmensen</li><li><strong>Solteo:</strong> zonnecalculator (indien u de simulator gebruikt)</li><li><strong>Google Analytics:</strong> bezoekersstatistieken (geanonimiseerd, alleen na toestemming)</li></ul><p>Gegevens worden <strong>niet</strong> gedeeld tussen de verschillende sites van de Satyvo SA-constellatie.</p>` },
        { heading: "5. Bewaartermijn", content: `<ul><li><strong>Leads/offertes:</strong> maximaal 30 dagen, daarna automatisch verwijderd</li><li><strong>Gebruikersaccount (Tweede Brein):</strong> bewaard zolang het account actief is</li><li><strong>Analytische cookies:</strong> maximaal 13 maanden (GA4)</li></ul>` },
        { heading: "6. Uw rechten", content: `Conform de AVG heeft u recht op:<ul><li>Inzage in uw gegevens</li><li>Rectificatie</li><li>Wissing ("recht om vergeten te worden")</li><li>Overdraagbaarheid van gegevens</li><li>Bezwaar tegen verwerking</li></ul><p>Om deze rechten uit te oefenen: <a href="mailto:info@satyvo.be">info@satyvo.be</a></p><p>Bij klachten kunt u contact opnemen met de Gegevensbeschermingsautoriteit (GBA): <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener">gegevensbeschermingsautoriteit.be</a></p>` },
        { heading: "7. Beveiliging", content: `Wij implementeren:<ul><li>Verplicht HTTPS op alle pagina's</li><li>Beveiligingsheaders (CSP, HSTS, X-Frame-Options)</li><li>CSRF-bescherming op formulieren</li><li>Rate limiting op API's</li><li>Gegevens opgeslagen binnen de EU (Supabase EU)</li></ul>` },
      ],
    },
  },
  en: {
    mentionsLegales: {
      title: "Legal Notice",
      sections: [
        { heading: "1. Publisher", content: `<strong>Habitat3RI.eu</strong> is a website published by:<ul><li><strong>Company:</strong> Satyvo SA</li><li><strong>Legal form:</strong> Belgian limited company (SA)</li><li><strong>BCE number:</strong> 0791.828.816</li><li><strong>VAT:</strong> BE0791828816</li><li><strong>Country:</strong> Belgium</li><li><strong>Email:</strong> <a href="mailto:info@satyvo.be">info@satyvo.be</a></li></ul>` },
        { heading: "2. Hosting", content: `<ul><li><strong>Company:</strong> Vercel Inc.</li><li><strong>Address:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li></ul><p>Data is served via Vercel's global CDN with points of presence within the European Union.</p>` },
        { heading: "3. Intellectual Property", content: `All content on this website (texts, images, logos, structure) is the property of Satyvo SA or used with permission. Any reproduction without prior written consent is prohibited.` },
        { heading: "4. Data Protection (GDPR)", content: `Your personal data is processed in accordance with the GDPR.<ul><li><strong>Data collected:</strong> name, email, phone number, postal code (via quote form)</li><li><strong>Purpose:</strong> connecting you with verified professionals for quotes</li><li><strong>Retention:</strong> 30 days maximum, then automatically deleted</li><li><strong>Third parties:</strong> data may be shared with Bobex (matching) and Google Analytics (anonymized)</li></ul><p>You have the right to access, rectify, delete and port your data. Contact: <a href="mailto:info@satyvo.be">info@satyvo.be</a>.</p>` },
        { heading: "5. Cookies", content: `This site uses:<ul><li><strong>Technical session cookies:</strong> required for form operation (CSRF). No consent needed.</li><li><strong>Google Analytics (GA4):</strong> analytics cookies loaded only after consent. IPs anonymized.</li></ul>` },
        { heading: "6. Limitation of Liability", content: `Information on this site is indicative and may change. Satyvo SA is not liable for accuracy or completeness. Price indications are estimates (±25-35%); only professional quotes are binding.<p>Satyvo SA is not an intermediary. We do not provide legal, financial or technical advice.</p>` },
        { heading: "7. Applicable Law", content: `This website is governed by Belgian law. Disputes fall under the jurisdiction of Belgian courts.` },
      ],
    },
    confidentialite: {
      title: "Privacy Policy",
      sections: [
        { heading: "1. Data Controller", content: `<strong>Satyvo SA</strong><br>BCE: 0791.828.816<br>Email: <a href="mailto:info@satyvo.be">info@satyvo.be</a>` },
        { heading: "2. Data Collected", content: `We collect via our forms:<ul><li>First and last name</li><li>Email address</li><li>Phone number</li><li>Postal code</li><li>Project type</li><li>Optional project description</li></ul>` },
        { heading: "3. Purposes", content: `Your data is used to:<ul><li>Connect you with qualified professionals via Bobex</li><li>Send you requested quotes</li><li>Improve our services (anonymized stats via Google Analytics)</li></ul><p>Your data is <strong>never</strong> sold for marketing purposes.</p>` },
        { heading: "4. Data Sharing", content: `Your data may be shared with:<ul><li><strong>Bobex.be / Bobex.nl:</strong> professional matching platform</li><li><strong>Solteo:</strong> solar calculator</li><li><strong>Google Analytics:</strong> anonymized statistics, loaded only after consent</li></ul><p>Data is <strong>not</strong> shared between Satyvo SA constellation sites.</p>` },
        { heading: "5. Retention", content: `<ul><li><strong>Leads:</strong> 30 days max, then auto-deleted</li><li><strong>User accounts (Second Brain):</strong> kept while active</li><li><strong>Analytics cookies:</strong> 13 months max (GA4)</li></ul>` },
        { heading: "6. Your Rights", content: `Under GDPR you have the right to access, rectify, erase, port, and object to processing of your data.<p>Contact: <a href="mailto:info@satyvo.be">info@satyvo.be</a></p><p>Complaints: Belgian Data Protection Authority (APD): <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener">autoriteprotectiondonnees.be</a></p>` },
        { heading: "7. Security", content: `We implement: HTTPS everywhere, security headers (CSP, HSTS), CSRF protection, rate limiting, EU data storage (Supabase EU).` },
      ],
    },
  },
  de: {
    mentionsLegales: {
      title: "Impressum",
      sections: [
        { heading: "1. Herausgeber", content: `<strong>Habitat3RI.eu</strong> wird betrieben von:<ul><li><strong>Firma:</strong> Satyvo SA</li><li><strong>Rechtsform:</strong> Belgische Aktiengesellschaft</li><li><strong>BCE-Nr.:</strong> 0791.828.816</li><li><strong>USt-IdNr.:</strong> BE0791828816</li><li><strong>Land:</strong> Belgien</li><li><strong>E-Mail:</strong> <a href="mailto:info@satyvo.be">info@satyvo.be</a></li></ul>` },
        { heading: "2. Hosting", content: `<ul><li><strong>Firma:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li></ul><p>Daten werden über das globale CDN von Vercel mit Präsenzpunkten innerhalb der EU bereitgestellt.</p>` },
        { heading: "3. Geistiges Eigentum", content: `Alle Inhalte dieser Website sind Eigentum von Satyvo SA. Jede Vervielfältigung ohne vorherige schriftliche Genehmigung ist untersagt.` },
        { heading: "4. Datenschutz (DSGVO)", content: `Ihre Daten werden DSGVO-konform verarbeitet.<ul><li><strong>Erhobene Daten:</strong> Name, E-Mail, Telefon, Postleitzahl</li><li><strong>Zweck:</strong> Vermittlung an geprüfte Fachleute</li><li><strong>Speicherdauer:</strong> maximal 30 Tage</li><li><strong>Dritte:</strong> Bobex (Vermittlung), Google Analytics (anonymisiert)</li></ul><p>Kontakt: <a href="mailto:info@satyvo.be">info@satyvo.be</a></p>` },
        { heading: "5. Cookies", content: `Technische Cookies (CSRF) ohne Zustimmung. Google Analytics nur nach Zustimmung, IP anonymisiert.` },
        { heading: "6. Haftungsbeschränkung", content: `Angaben sind unverbindlich (±25-35%). Satyvo SA ist kein Vermittler und bietet keine rechtliche, finanzielle oder technische Beratung.` },
        { heading: "7. Anwendbares Recht", content: `Belgisches Recht. Gerichtsstand: Belgien.` },
      ],
    },
    confidentialite: {
      title: "Datenschutzerklärung",
      sections: [
        { heading: "1. Verantwortlicher", content: `<strong>Satyvo SA</strong>, BCE 0791.828.816, <a href="mailto:info@satyvo.be">info@satyvo.be</a>` },
        { heading: "2. Erhobene Daten", content: `Name, E-Mail, Telefon, PLZ, Projekttyp, optionale Beschreibung.` },
        { heading: "3. Zwecke", content: `Vermittlung an Fachleute via Bobex, Zustellung von Angeboten, Statistiken (anonymisiert). Ihre Daten werden <strong>nie</strong> für Marketing verkauft.` },
        { heading: "4. Weitergabe", content: `Bobex.be/Bobex.nl, Solteo (Solarrechner), Google Analytics (nur nach Zustimmung). Keine Weitergabe zwischen Satyvo-Websites.` },
        { heading: "5. Speicherdauer", content: `Leads: 30 Tage. Benutzerkonten: solange aktiv. Analytics-Cookies: 13 Monate.` },
        { heading: "6. Ihre Rechte", content: `Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch. Kontakt: <a href="mailto:info@satyvo.be">info@satyvo.be</a>. Beschwerde: Belgische Datenschutzbehörde (APD).` },
        { heading: "7. Sicherheit", content: `HTTPS, CSP/HSTS-Header, CSRF-Schutz, Rate Limiting, EU-Datenspeicherung.` },
      ],
    },
  },
  lb: {
    mentionsLegales: {
      title: "Impressum",
      sections: [
        { heading: "1. Editeur", content: `<strong>Habitat3RI.eu</strong> gëtt verwalt vun:<ul><li><strong>Firma:</strong> Satyvo SA</li><li><strong>Rechtsform:</strong> Belsch Aktiounsgesellschaft</li><li><strong>BCE-Nr.:</strong> 0791.828.816</li><li><strong>TVA:</strong> BE0791828816</li><li><strong>Land:</strong> Belsch</li><li><strong>E-Mail:</strong> <a href="mailto:info@satyvo.be">info@satyvo.be</a></li></ul>` },
        { heading: "2. Hosting", content: `Vercel Inc., 340 S Lemon Ave, Walnut, CA, USA. Daten ginn iwwer EU CDN-Punkten verdeelt.` },
        { heading: "3. Geeschtegt Eegentum", content: `All Inhalt vun dëser Website ass Eegentum vu Satyvo SA. Keng Reproduktioun ouni schrëftlech Erlaabnes.` },
        { heading: "4. Dateschutz (RGPD)", content: `Är Donnéeë ginn RGPD-konform veraarbecht. Kontakt: <a href="mailto:info@satyvo.be">info@satyvo.be</a>. Réclamatioun: CNPD Lëtzebuerg (<a href="https://cnpd.public.lu" target="_blank" rel="noopener">cnpd.public.lu</a>).` },
        { heading: "5. Cookies", content: `Technesch Cookies (CSRF) ouni Zoustëmmung. Google Analytics nëmmen no Zoustëmmung, IP anonymiséiert.` },
        { heading: "6. Haftungsbeschränkung", content: `Informatiounen sinn indicativ (±25-35%). Satyvo SA ass keen Tëschenhändler a bitt keng juristesch, finanziell oder technesch Berodung.` },
        { heading: "7. Applicabelt Recht", content: `Belsch Recht. Geriichtsstand: Belsch.` },
      ],
    },
    confidentialite: {
      title: "Dateschutzpolitik",
      sections: [
        { heading: "1. Verantwortlechen", content: `<strong>Satyvo SA</strong>, BCE 0791.828.816, <a href="mailto:info@satyvo.be">info@satyvo.be</a>` },
        { heading: "2. Gesammelten Donnéeën", content: `Numm, E-Mail, Telefon, Postleitzuel, Projettyp.` },
        { heading: "3. Zwecker", content: `Vermëttlung un Fachleit via Bobex. Statistiken (anonymiséiert). Kee Marketing-Verkaf.` },
        { heading: "4. Weidergab", content: `Bobex.be, Solteo, Google Analytics (no Zoustëmmung). Keen Austausch tëschent Satyvo-Siten.` },
        { heading: "5. Späicherdauer", content: `Leads: 30 Deeg. Konten: sou laang wéi aktiv. Analytics: 13 Méint.` },
        { heading: "6. Är Rechter", content: `Zougang, Korrektur, Läschung, Portabilitéit, Widderstëmm. CNPD: <a href="https://cnpd.public.lu" target="_blank" rel="noopener">cnpd.public.lu</a>` },
        { heading: "7. Sécherheet", content: `HTTPS, CSP/HSTS, CSRF, Rate Limiting, EU Datelaagerung.` },
      ],
    },
  },
};
