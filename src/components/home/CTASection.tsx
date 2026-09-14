"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function CTASection() {
  const tHome = useTranslations("home");
  const tWhatsapp = useTranslations("whatsapp");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    tWhatsapp("defaultMessage")
  )}`;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="cta-title"
    >
      {/* Dark mountain gradient background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 150% 80% at 30% 100%, #14532d 0%, transparent 50%)",
              "radial-gradient(ellipse 120% 60% at 70% 90%, #1e293b 0%, transparent 50%)",
              "linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            ].join(", "),
          }}
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" aria-hidden="true">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          id="cta-title"
          className="text-3xl font-heading font-bold text-white md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          {tHome("ctaTitle")}
        </motion.h2>

        <motion.p
          className="mx-auto mt-4 max-w-xl text-lg text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 0.15,
          }}
        >
          {tHome("ctaSubtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 0.3,
          }}
        >
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-lg bg-summit-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {tHome("ctaCustomize")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#25D366] bg-[#25D366]/10 px-8 py-3.5 text-base font-bold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={tHome("ctaWhatsapp")}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {tHome("ctaWhatsapp")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
