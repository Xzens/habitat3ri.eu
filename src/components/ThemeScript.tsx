"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("habitat3ri-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldBeDark = stored === "dark" || (!stored && prefersDark);
      document.documentElement.classList.toggle("dark", shouldBeDark);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return null;
}
