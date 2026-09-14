"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Mountain,
  Award,
  ArrowRight,
  Quote,
  Trophy,
  Calendar,
  Compass,
  BadgeCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CEO_NAME } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */

const CEO_STATS = [
  { value: "50+", key: "statSummits" as const, icon: Mountain },
  { value: "10+", key: "statYears" as const, icon: Calendar },
  { value: "200+", key: "statExpeditions" as const, icon: Compass },
  { value: "5", key: "statCertifications" as const, icon: BadgeCheck },
];

/* ------------------------------------------------------------------ */
/*  Achievements list                                                  */
/* ------------------------------------------------------------------ */

const ACHIEVEMENT_KEYS = [
  "achievement1",
  "achievement2",
  "achievement3",
  "achievement4",
  "achievement5",
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CeoContent() {
  const t = useTranslations("ceoPage");
  const shouldReduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLElement>(null);
  const achievementsRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });
  const profileInView = useInView(profileRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const bioInView = useInView(bioRef, { once: true, margin: "-80px" });
  const achievementsInView = useInView(achievementsRef, {
    once: true,
    margin: "-80px",
  });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="pt-20 lg:pt-24">
      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-20 md:py-28"
        aria-labelledby="ceo-hero-title"
      >
        {/* Gradient background */}
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 180% 70% at 50% 90%, #14532d 0%, transparent 50%)",
                "radial-gradient(ellipse 140% 50% at 20% 80%, #1e293b 0%, transparent 50%)",
                "radial-gradient(ellipse 120% 40% at 80% 70%, #431407 0%, transparent 50%)",
                "linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
              ].join(", "),
            }}
          />
          {/* Subtle star overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(1px 1px at 15% 20%, white 1px, transparent 0), radial-gradient(1px 1px at 55% 15%, white 1px, transparent 0), radial-gradient(1px 1px at 75% 25%, white 1px, transparent 0), radial-gradient(1px 1px at 35% 10%, white 1px, transparent 0), radial-gradient(1px 1px at 85% 8%, white 1px, transparent 0)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            id="ceo-hero-title"
            className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
            }}
          >
            {t("heroSubtitle")}
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Profile Card                                                  */}
      {/* ============================================================ */}
      <section ref={profileRef} className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center gap-8 md:flex-row md:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={
              profileInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            {/* Photo placeholder */}
            <div className="relative flex-shrink-0">
              <div
                className="h-64 w-64 overflow-hidden rounded-2xl shadow-xl sm:h-72 sm:w-72"
                style={{
                  background:
                    "linear-gradient(135deg, #14532d 0%, #15803d 30%, #22c55e 60%, #4ade80 100%)",
                }}
              >
                <Mountain
                  className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white/20"
                  strokeWidth={1}
                  aria-hidden="true"
                />
                <svg
                  className="absolute bottom-0 left-0 w-full text-white/10"
                  viewBox="0 0 300 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0,80 L0,50 L60,25 L100,40 L150,15 L200,35 L250,10 L300,30 L300,80 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-forest-400/30 to-summit-400/30 blur-sm" />
            </div>

            {/* Name & title */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-heading font-bold text-slate-900 sm:text-3xl md:text-4xl">
                {CEO_NAME}
              </h2>
              <p className="mt-2 text-lg font-medium text-summit-600">
                {t("title")}
              </p>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-forest-500 to-summit-500 md:mx-0 mx-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Stats                                                         */}
      {/* ============================================================ */}
      <section
        ref={statsRef}
        className="bg-slate-50 py-12 md:py-16"
        aria-labelledby="ceo-stats-title"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.h3
            id="ceo-stats-title"
            className="sr-only"
          >
            {t("statsTitle")}
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {CEO_STATS.map(({ value, key, icon: Icon }) => (
              <motion.div
                key={key}
                variants={cardVariant}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <Icon
                  className="mx-auto mb-3 h-8 w-8 text-forest-600"
                  aria-hidden="true"
                />
                <p className="text-3xl font-heading font-bold text-slate-900">
                  {value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{t(key)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Bio                                                           */}
      {/* ============================================================ */}
      <section
        ref={bioRef}
        className="py-16 md:py-24"
        aria-labelledby="ceo-bio-title"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={bioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <h2
              id="ceo-bio-title"
              className="mb-8 text-center text-3xl font-heading font-bold text-slate-900 md:text-4xl"
            >
              {t("bioTitle")}
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-slate-600 md:text-lg">
              <p>{t("bioP1")}</p>
              <p>{t("bioP2")}</p>
              <p>{t("bioP3")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Achievements                                                  */}
      {/* ============================================================ */}
      <section
        ref={achievementsRef}
        className="bg-slate-50 py-16 md:py-24"
        aria-labelledby="achievements-title"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            id="achievements-title"
            className="mb-10 text-center text-3xl font-heading font-bold text-slate-900 md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={
              achievementsInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            {t("achievementsTitle")}
          </motion.h2>

          <motion.ul
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate={achievementsInView ? "visible" : "hidden"}
          >
            {ACHIEVEMENT_KEYS.map((key) => (
              <motion.li
                key={key}
                variants={cardVariant}
                className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700">
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="pt-1.5 text-base text-slate-700">{t(key)}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Philosophy Quote                                              */}
      {/* ============================================================ */}
      <section
        ref={quoteRef}
        className="py-16 md:py-24"
        aria-labelledby="philosophy-title"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={
              quoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <h2
              id="philosophy-title"
              className="mb-8 text-2xl font-heading font-bold text-slate-900 md:text-3xl"
            >
              {t("philosophyTitle")}
            </h2>
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
              <Quote
                className="absolute top-4 left-4 h-10 w-10 text-forest-200 md:top-6 md:left-6 md:h-12 md:w-12"
                aria-hidden="true"
              />
              <blockquote className="relative z-10 text-lg italic leading-relaxed text-slate-700 md:text-xl">
                &ldquo;{t("philosophyQuote")}&rdquo;
              </blockquote>
              <p className="mt-6 font-heading font-semibold text-forest-700">
                &mdash; {CEO_NAME}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA                                                           */}
      {/* ============================================================ */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden py-16 md:py-24"
        aria-labelledby="ceo-cta-title"
      >
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
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            id="ceo-cta-title"
            className="text-3xl font-heading font-bold text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            {t("ctaTitle")}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
            }}
          >
            {t("ctaSubtitle")}
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.3,
            }}
          >
            <Link
              href="/expediciones"
              className="inline-flex items-center gap-2 rounded-lg bg-summit-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-summit-600 focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
