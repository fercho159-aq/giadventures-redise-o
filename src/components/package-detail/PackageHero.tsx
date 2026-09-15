import Image from "next/image";
import {
  Clock,
  Mountain,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import DifficultyBadge from "./DifficultyBadge";
import type { DIFFICULTY_COLORS } from "@/lib/constants";

interface PackageHeroProps {
  title: string;
  subtitle?: string;
  mainImageAlt: string;
  image?: string;
  duration: { days: number; nights: number };
  altitude: number | null;
  difficulty: keyof typeof DIFFICULTY_COLORS;
  groupSize: { min: number; max: number } | null;
}

export default function PackageHero({
  title,
  subtitle,
  mainImageAlt,
  image,
  duration,
  altitude,
  difficulty,
  groupSize,
}: PackageHeroProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full overflow-hidden">
      {/* Background image */}
      {image ? (
        <Image
          src={image}
          alt={mainImageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-700 via-forest-800 to-slate-900"
          role="img"
          aria-label={mainImageAlt}
        />
      )}

      {/* Gradient overlay from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

      {/* Breadcrumb at top */}
      <nav
        className="absolute top-0 left-0 right-0 z-10 pt-20 lg:pt-24"
        aria-label="Breadcrumb"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-white/70">
            <li>
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link
                href="/expediciones"
                className="hover:text-white transition-colors"
              >
                Expediciones
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="text-white font-medium truncate max-w-[200px]" aria-current="page">
              {title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-white/80 md:text-xl max-w-2xl">
              {subtitle}
            </p>
          )}

          {/* Quick stat badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                "bg-white/15 text-white backdrop-blur-sm border border-white/20"
              )}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              {duration.days} dias / {duration.nights} noches
            </span>

            {altitude ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                  "bg-white/15 text-white backdrop-blur-sm border border-white/20"
                )}
              >
                <Mountain className="h-4 w-4" aria-hidden="true" />
                {altitude.toLocaleString("es-MX")} msnm
              </span>
            ) : null}

            {groupSize && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                  "bg-white/15 text-white backdrop-blur-sm border border-white/20"
                )}
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                {groupSize.min}-{groupSize.max} personas
              </span>
            )}

            <DifficultyBadge difficulty={difficulty} size="sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
