"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, Zap } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderProps = {
  locale: "fr" | "nl";
  dict: {
    nav: {
      home: string;
      pillars: string;
      solutions: string;
      blog: string;
      partners: string;
      contact: string;
      darkMode: string;
      lightMode: string;
    };
  };
};

const navItems = [
  { key: "home", href: "#accueil" },
  { key: "pillars", href: "#piliers" },
  { key: "solutions", href: "#solutions" },
  { key: "blog", href: "#blog" },
  { key: "partners", href: "#partenaires" },
  { key: "contact", href: "#contact" },
] as const;

export default function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocale = locale === "fr" ? "nl" : "fr";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-eco-green to-energy-blue transition-transform group-hover:scale-110">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Habitat</span>
            <span className="text-solar-orange">3RI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {dict.nav[item.key as keyof typeof dict.nav]}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <Link
            href={`/${otherLocale}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{otherLocale.toUpperCase()}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={resolvedTheme === "dark" ? dict.nav.lightMode : dict.nav.darkMode}
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden bg-gradient-to-r from-eco-green to-energy-blue text-white hover:opacity-90 sm:inline-flex"
            )}
          >
            {dict.nav.contact}
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden border-t border-border lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {dict.nav[item.key as keyof typeof dict.nav]}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants(),
                  "mt-2 bg-gradient-to-r from-eco-green to-energy-blue text-white"
                )}
              >
                {dict.nav.contact}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
