import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Ne pas bloquer /_next/ : Google a besoin du CSS et du JS pour evaluer
        // le rendu et la compatibilite mobile. Seules les routes API sont exclues.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://habitat3ri.eu/sitemap.xml",
  };
}
