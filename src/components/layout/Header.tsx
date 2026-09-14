"use client";

import { useState, useEffect, useCallback } from "react";
import { Mountain, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-black/30 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label={`${SITE_NAME} - Inicio`}
          >
            <Mountain
              className={cn(
                "h-7 w-7 transition-colors lg:h-8 lg:w-8",
                scrolled ? "text-forest-700" : "text-white"
              )}
            />
            <span
              className={cn(
                "text-lg font-heading font-bold tracking-wide transition-colors lg:text-xl",
                scrolled ? "text-slate-900" : "text-white"
              )}
            >
              ADVENTURES
              <span
                className={cn(
                  "transition-colors",
                  scrolled ? "text-summit-500" : "text-summit-400"
                )}
              >
                {" "}GI
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Desktop locale switcher */}
            <div className="hidden lg:block">
              <LocaleSwitcher />
            </div>

            {/* CTA button (desktop) */}
            <Link
              href="/expediciones"
              className="hidden lg:inline-flex items-center rounded-lg bg-summit-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2"
            >
              {t("book")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("openMenu")}
              className={cn(
                "rounded-lg p-2 lg:hidden transition-colors",
                scrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
