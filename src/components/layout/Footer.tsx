import { Mountain, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  SITE_NAME,
  INSTAGRAM_URL,
  TIKTOK_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_LINK,
} from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo + tagline + socials */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} - Inicio`}>
              <Mountain className="h-7 w-7 text-forest-400" />
              <span className="text-lg font-heading font-bold text-white tracking-wide">
                ADVENTURES
                <span className="text-summit-400"> GI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.27 8.27 0 005.58 2.17V11.7a4.85 4.85 0 01-3.77-1.24V6.69h3.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-heading font-semibold uppercase tracking-wider text-white">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/expediciones" className="text-sm hover:text-white transition-colors">
                  {t("expeditions")}
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-sm hover:text-white transition-colors">
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm hover:text-white transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/nuestra-ceo" className="text-sm hover:text-white transition-colors">
                  {t("ceo")}
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-sm hover:text-white transition-colors">
                  {t("gallery")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="mb-4 text-sm font-heading font-semibold uppercase tracking-wider text-white">
              {t("categoriesTitle")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categorias/principiante" className="text-sm hover:text-white transition-colors">
                  {t("beginner")}
                </Link>
              </li>
              <li>
                <Link href="/categorias/avanzado" className="text-sm hover:text-white transition-colors">
                  {t("advanced")}
                </Link>
              </li>
              <li>
                <Link href="/categorias/alto-rendimiento" className="text-sm hover:text-white transition-colors">
                  {t("highPerformance")}
                </Link>
              </li>
              <li>
                <Link href="/categorias/internacionales" className="text-sm hover:text-white transition-colors">
                  {t("international")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h3 className="mb-4 text-sm font-heading font-semibold uppercase tracking-wider text-white">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-summit-400" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-summit-400" />
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-500">
            {t("copyright", { year: currentYear.toString() })}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terminos" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacidad" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
