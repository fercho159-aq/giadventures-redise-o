"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Clock,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  TIKTOK_URL,
} from "@/lib/constants";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.4a8.16 8.16 0 004.76 1.52V7.48a4.85 4.85 0 01-1-.79z" />
    </svg>
  );
}

export default function ContactInfo() {
  const t = useTranslations("contactPage");
  const tWhatsapp = useTranslations("whatsapp");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sidebarRef, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  const duration = shouldReduceMotion ? 0 : 0.5;
  const baseDelay = shouldReduceMotion ? 0 : 0.2;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    tWhatsapp("defaultMessage")
  )}`;

  return (
    <motion.aside
      ref={sidebarRef}
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, delay: baseDelay }}
      aria-label={t("infoTitle")}
    >
      {/* Contact information card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-heading font-bold text-slate-900">
          {t("infoTitle")}
        </h3>

        <ul className="mt-5 space-y-4">
          {/* Email */}
          <li>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-forest-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-100">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="pt-1.5">
                <span className="block text-xs font-medium text-slate-500">
                  {t("emailInfo")}
                </span>
                <span className="block font-medium">{CONTACT_EMAIL}</span>
              </span>
            </a>
          </li>

          {/* Phone */}
          <li>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="group flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-forest-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-100">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="pt-1.5">
                <span className="block text-xs font-medium text-slate-500">
                  {t("phoneInfo")}
                </span>
                <span className="block font-medium">{CONTACT_PHONE}</span>
              </span>
            </a>
          </li>

          {/* WhatsApp */}
          <li>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-[#25D366]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366]/20">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="pt-1.5">
                <span className="block text-xs font-medium text-slate-500">
                  {t("whatsappInfo")}
                </span>
                <span className="block font-medium">{t("whatsappMessage")}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      {/* Social media card */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration, delay: baseDelay + 0.1 }}
      >
        <h3 className="text-lg font-heading font-bold text-slate-900">
          {t("socialTitle")}
        </h3>

        <div className="mt-4 flex gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white transition-transform hover:scale-105"
            aria-label={`${t("instagram")} - @adventures_gi`}
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform hover:scale-105"
            aria-label={`${t("tiktok")} - @adventuresgigi`}
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <p>
            <span className="font-medium">{t("instagram")}:</span> @adventures_gi
          </p>
          <p>
            <span className="font-medium">{t("tiktok")}:</span> @adventuresgigi
          </p>
        </div>
      </motion.div>

      {/* Business hours card */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration, delay: baseDelay + 0.2 }}
      >
        <h3 className="flex items-center gap-2 text-lg font-heading font-bold text-slate-900">
          <Clock className="h-5 w-5 text-summit-500" aria-hidden="true" />
          {t("hoursTitle")}
        </h3>

        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-forest-500" aria-hidden="true" />
            {t("hoursWeekday")}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-summit-500" aria-hidden="true" />
            {t("hoursSaturday")}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden="true" />
            {t("hoursSunday")}
          </li>
        </ul>

        <p className="mt-4 rounded-lg bg-forest-50 p-3 text-xs leading-relaxed text-forest-700">
          {t("hoursNote")}
        </p>
      </motion.div>

      {/* Location hint */}
      <motion.div
        className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration, delay: baseDelay + 0.3 }}
      >
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        Ciudad de Mexico, Mexico
      </motion.div>
    </motion.aside>
  );
}
