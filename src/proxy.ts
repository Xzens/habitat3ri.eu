import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

const langMap: Record<string, Locale> = {
  fr: "fr",
  nl: "nl",
  en: "en",
  de: "de",
  lb: "lb",
  lu: "lb",
};

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

  for (const pref of preferred) {
    if (langMap[pref]) return langMap[pref];
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocaleFromHeaders(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
