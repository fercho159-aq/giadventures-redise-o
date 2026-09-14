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
  Heart,
  Shield,
  Award,
  ArrowRight,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/* ------------------------------------------------------------------ */
/*  Mock team data                                                     */
/* ------------------------------------------------------------------ */

interface TeamMember {
  id: string;
  name: string;
  roleKey: string;
  certifications: string[];
  yearsExperience: number;
  gradient: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Giovanna Venegas Rangel",
    roleKey: "CEO & Guía Principal",
    certifications: ["Guía de Alta Montaña", "Primeros Auxilios en Montaña"],
    yearsExperience: 10,
    gradient: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #22c55e 100%)",
  },
  {
    id: "2",
    name: "Carlos Mendoza Rivera",
    roleKey: "Guía de Expediciones",
    certifications: ["Guía de Media Montaña", "Rescate en Montaña"],
    yearsExperience: 8,
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 40%, #94a3b8 100%)",
  },
  {
    id: "3",
    name: "Ana Lucía Martínez",
    roleKey: "Guía de Expediciones",
    certifications: ["Guía de Alta Montaña", "Manejo de Cuerdas"],
    yearsExperience: 6,
    gradient: "linear-gradient(135deg, #431407 0%, #9a3412 40%, #fb923c 100%)",
  },
  {
    id: "4",
    name: "Roberto Sánchez Ortiz",
    roleKey: "Guía de Aclimatación",
    certifications: ["Técnico en Montaña", "Primeros Auxilios Wilderness"],
    yearsExperience: 5,
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #38bdf8 100%)",
  },
];

/* ------------------------------------------------------------------ */
/*  Values / pillars                                                   */
/* ------------------------------------------------------------------ */

const PILLARS = [
  { icon: Mountain, key: "mission" as const },
  { icon: Heart, key: "vision" as const },
  { icon: Shield, key: "values" as const },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NosotrosContent() {
  const t = useTranslations("aboutPage");
  const shouldReduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
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
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15 },
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
        className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 md:py-28"
        aria-labelledby="about-hero-title"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 150% 60% at 20% 90%, #14532d 0%, transparent 50%)",
                "radial-gradient(ellipse 120% 50% at 80% 80%, #1e293b 0%, transparent 50%)",
                "linear-gradient(to bottom, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
              ].join(", "),
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            id="about-hero-title"
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
      {/* Mission / Vision / Values                                     */}
      {/* ============================================================ */}
      <section
        ref={valuesRef}
        className="py-16 md:py-24"
        aria-labelledby="values-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {PILLARS.map(({ icon: Icon, key }) => (
              <motion.div
                key={key}
                variants={cardVariant}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-forest-100 text-forest-700 transition-colors group-hover:bg-forest-700 group-hover:text-white">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-bold text-slate-900">
                  {t(`${key}Title`)}
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  {t(`${key}Desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Our Story                                                     */}
      {/* ============================================================ */}
      <section
        ref={storyRef}
        className="bg-slate-50 py-16 md:py-24"
        aria-labelledby="story-title"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <h2
              id="story-title"
              className="mb-8 text-center text-3xl font-heading font-bold text-slate-900 md:text-4xl"
            >
              {t("storyTitle")}
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-slate-600 md:text-lg">
              <p>{t("storyP1")}</p>
              <p>{t("storyP2")}</p>
              <p>{t("storyP3")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Team                                                          */}
      {/* ============================================================ */}
      <section
        ref={teamRef}
        className="py-16 md:py-24"
        aria-labelledby="team-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={
              teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <h2
              id="team-title"
              className="text-3xl font-heading font-bold text-slate-900 md:text-4xl"
            >
              {t("teamTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              {t("teamSubtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariant}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Photo placeholder */}
                <div
                  className="relative h-56 w-full overflow-hidden"
                  style={{ background: member.gradient }}
                >
                  <Users
                    className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white/20"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                  <svg
                    className="absolute bottom-0 left-0 w-full text-white/10"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,100 L0,60 L80,30 L150,50 L200,20 L280,45 L350,15 L400,40 L400,100 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-summit-600">
                    {member.roleKey}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Award
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-600"
                        aria-hidden="true"
                      />
                      <span>{member.certifications.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mountain
                        className="h-4 w-4 flex-shrink-0 text-forest-600"
                        aria-hidden="true"
                      />
                      <span>
                        {member.yearsExperience} {t("yearsExp")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA                                                           */}
      {/* ============================================================ */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden py-16 md:py-24"
        aria-labelledby="about-cta-title"
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
            id="about-cta-title"
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
