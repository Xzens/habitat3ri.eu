import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  fr: () => import("./messages/fr.json").then((m) => m.default),
  nl: () => import("./messages/nl.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  de: () => import("./messages/de.json").then((m) => m.default),
  lb: () => import("./messages/lb.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
