"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
}

const STATS: StatItem[] = [
  { value: 2000, suffix: "+", labelKey: "climbers" },
  { value: 150, suffix: "+", labelKey: "expeditions" },
  { value: 10, suffix: "+", labelKey: "years" },
  { value: 95, suffix: "%", labelKey: "successRate" },
];

function useCountUp(target: number, active: boolean, duration: number = 2000): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active, target, duration]);

  return count;
}

function StatCounter({
  stat,
  inView,
  index,
  shouldReduceMotion,
}: {
  stat: StatItem;
  inView: boolean;
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const t = useTranslations("stats");
  const count = useCountUp(stat.value, shouldReduceMotion ? true : inView);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 px-4 py-3"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.15,
        ease: "easeOut",
      }}
    >
      <span className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl">
        {shouldReduceMotion
          ? stat.value.toLocaleString("es-MX")
          : count.toLocaleString("es-MX")}
        <span className="text-summit-400">{stat.suffix}</span>
      </span>
      <span className="text-sm font-medium text-slate-400 sm:text-base">
        {t(stat.labelKey)}
      </span>
    </motion.div>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="bg-slate-900 py-12 md:py-16"
      aria-label="Statistics"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-2 gap-6",
            "md:grid-cols-4 md:gap-8",
            "divide-slate-700/50 md:divide-x"
          )}
        >
          {STATS.map((stat, i) => (
            <StatCounter
              key={stat.labelKey}
              stat={stat}
              inView={inView}
              index={i}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
