import Image from "next/image";
import { Mountain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import DifficultyBadge from "./DifficultyBadge";
import type { DIFFICULTY_COLORS } from "@/lib/constants";

interface RelatedPackage {
  slug: string;
  title: string;
  difficulty: keyof typeof DIFFICULTY_COLORS;
  pricePerPerson: number;
  currency: string;
  altitude: number | null;
  duration: { days: number; nights: number };
  placeholderColor: string;
  image?: string;
}

interface RelatedPackagesProps {
  packages: RelatedPackage[];
}

function RelatedCard({ pkg }: { pkg: RelatedPackage }) {
  return (
    <Link
      href={`/expediciones/${pkg.slug}`}
      className="group flex-shrink-0 w-[280px] md:w-auto block rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {/* Card image */}
      <div className="relative h-44 overflow-hidden">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 280px, 33vw"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", pkg.placeholderColor)} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <DifficultyBadge difficulty={pkg.difficulty} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
          {pkg.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          {pkg.altitude ? (
            <span className="flex items-center gap-1">
              <Mountain className="h-3 w-3" aria-hidden="true" />
              {pkg.altitude.toLocaleString("es-MX")} msnm
            </span>
          ) : null}
          <span>
            {pkg.duration.days} {pkg.duration.days === 1 ? "día" : "días"}
            {pkg.duration.nights > 0 &&
              ` / ${pkg.duration.nights} ${pkg.duration.nights === 1 ? "noche" : "noches"}`}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p>
            <span className="text-xs text-slate-500">Desde </span>
            <span className="text-base font-heading font-bold text-slate-900">
              {formatPrice(pkg.pricePerPerson, pkg.currency)}
            </span>
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-summit-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Ver mas
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedPackages({ packages }: RelatedPackagesProps) {
  return (
    <section aria-label="Paquetes relacionados" className="py-12 md:py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl mb-8">
          Tambien te puede interesar
        </h2>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {packages.map((pkg) => (
            <div key={pkg.slug} className="snap-start">
              <RelatedCard pkg={pkg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
