"use client";

import { useEffect } from "react";

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    // Check for cookie consent before loading GA4
    const consent = localStorage.getItem("habitat3ri-cookie-consent");
    if (consent !== "accepted") return;

    // Load gtag.js
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", gaId, {
      anonymize_ip: true,
      cookie_flags: "SameSite=Lax;Secure",
    });
  }, [gaId]);

  return null;
}

// Extend Window for dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
