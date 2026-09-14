"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Footprints, Compass, Mountain, Trophy, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

type DifficultyKey = keyof typeof DIFFICULTY_COLORS;

interface DifficultyLevel {
  key: DifficultyKey;
  icon: typeof Mountain;
  slug: string;
}

const LEVELS: DifficultyLevel[] = [
  { key: "principiante", icon: Footprints, slug: "principiante" },
  { key: "intermedio", icon: Compass, slug: "intermedio" },
  { key: "avanzado", icon: Mountain, slug: "avanzado" },
  { key: "alto-rendimiento", icon: Trophy, slug: "alto-rendimiento" },
];

export default function DifficultyLevels() {
  const tHome = useTranslations("home");
  const tDiff = useTranslations("difficulty");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24"
      aria-labelledby="difficulty-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <h2
            id="difficulty-title"
            className="text-3xl font-heading font-bold text-slate-900 md:text-4xl"
          >
            {tHome("difficultyTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {tHome("difficultySubtitle")}
          </p>
        </motion.div>

        {/* Cards: horizontal scroll on mobile, 4-col grid on desktop */}
        <motion.div
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {LEVELS.map((level) => {
            const Icon = level.icon;
            const colors = DIFFICULTY_COLORS[level.key];

            return (
              <motion.div
                key={level.key}
                className="w-[75vw] flex-shrink-0 snap-center sm:w-[55vw] md:w-auto"
                variants={cardVariants}
              >
                <Link
                  href={`/categorias/${level.slug}`}
                  className={cn(
                    "group flex h-full flex-col items-center rounded-2xl border p-6 text-center transition-all duration-300",
                    "hover:scale-[1.03] hover:shadow-xl",
                    "focus:outline-none focus:ring-2 focus:ring-forest-700 focus:ring-offset-2",
                    colors.border,
                    "bg-white"
                  )}
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110",
                      colors.bg
                    )}
                  >
                    <Icon className={cn("h-7 w-7", colors.text)} aria-hidden="true" />
                  </div>

                  {/* Level name */}
                  <h3
                    className={cn(
                      "mb-2 text-lg font-heading font-bold",
                      colors.text
                    )}
                  >
                    {tDiff(level.key)}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm leading-relaxed text-slate-600">
                    {tDiff(`${level.key}Desc`)}
                  </p>

                  {/* Link text */}
                  <span
                    className={cn(
                      "mt-auto inline-flex items-center gap-1 text-sm font-semibold transition-all",
                      colors.text,
                      "group-hover:gap-2"
                    )}
                  >
                    {tDiff("viewExpeditions")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
