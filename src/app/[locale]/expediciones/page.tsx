import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { Mountain, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { DifficultyBadge } from "@/components/package-detail";
import type { DIFFICULTY_COLORS } from "@/lib/constants";

interface MockPackage {
  slug: string;
  title: string;
  excerpt: string;
  difficulty: keyof typeof DIFFICULTY_COLORS;
  pricePerPerson: number;
  currency: string;
  altitude: number;
  duration: { days: number; nights: number };
  location: string;
  image: string;
}

const MOCK_PACKAGES: MockPackage[] = [
  {
    slug: "pico-de-orizaba",
    title: "Pico de Orizaba",
    excerpt: "La montana mas alta de Mexico. Expedicion de 3 dias al techo de Mexico con ascenso por el Glaciar de Jamapa.",
    difficulty: "avanzado",
    pricePerPerson: 8500,
    currency: "MXN",
    altitude: 5636,
    duration: { days: 3, nights: 2 },
    location: "Puebla, Mexico",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=75",
  },
  {
    slug: "iztaccihuatl",
    title: "Iztaccihuatl",
    excerpt: "La Mujer Dormida. Travesia clasica por las rodillas y el pecho hasta alcanzar la cumbre a 5,230 msnm.",
    difficulty: "intermedio",
    pricePerPerson: 5500,
    currency: "MXN",
    altitude: 5230,
    duration: { days: 2, nights: 1 },
    location: "Estado de Mexico",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=75",
  },
  {
    slug: "nevado-de-toluca",
    title: "Nevado de Toluca",
    excerpt: "Volcan perfecto para iniciar en el alpinismo. Ascenso al Pico del Fraile con vistas a las lagunas del Sol y la Luna.",
    difficulty: "principiante",
    pricePerPerson: 2800,
    currency: "MXN",
    altitude: 4680,
    duration: { days: 1, nights: 0 },
    location: "Estado de Mexico",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=75",
  },
  {
    slug: "la-malinche",
    title: "La Malinche",
    excerpt: "Montana ideal para tu primera experiencia en alta montana. Ascenso gradual con vistas panoramicas del Valle de Puebla.",
    difficulty: "principiante",
    pricePerPerson: 2200,
    currency: "MXN",
    altitude: 4461,
    duration: { days: 1, nights: 0 },
    location: "Tlaxcala, Mexico",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=75",
  },
  {
    slug: "cotopaxi-ecuador",
    title: "Cotopaxi, Ecuador",
    excerpt: "Expedicion internacional al volcan activo mas alto del mundo. Incluye aclimatacion y ascenso tecnico con crampones.",
    difficulty: "alto-rendimiento",
    pricePerPerson: 35000,
    currency: "MXN",
    altitude: 5897,
    duration: { days: 7, nights: 6 },
    location: "Cotopaxi, Ecuador",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=75",
  },
  {
    slug: "sierra-negra",
    title: "Sierra Negra",
    excerpt: "Vecino del Pico de Orizaba, con 4,580 msnm. Excelente opcion de aclimatacion o para alpinistas intermedios.",
    difficulty: "intermedio",
    pricePerPerson: 4200,
    currency: "MXN",
    altitude: 4580,
    duration: { days: 2, nights: 1 },
    location: "Puebla, Mexico",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=75",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Our Expeditions" : "Nuestras Expediciones",
    description:
      locale === "en"
        ? "Explore our mountaineering expeditions across Mexico and the world."
        : "Explora nuestras expediciones de alpinismo en Mexico y el mundo.",
  };
}

export default async function ExpedicionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-20 lg:pt-24">
      {/* Page header with background image */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl">
            {locale === "en" ? "Our Expeditions" : "Nuestras Expediciones"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            {locale === "en"
              ? "From your first summit to the highest peaks in the Americas. Find the expedition that matches your level."
              : "Desde tu primera cumbre hasta los picos mas altos de America. Encuentra la expedicion que se adapte a tu nivel."}
          </p>
        </div>
      </section>

      {/* Packages grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PACKAGES.map((pkg) => (
              <Link
                key={pkg.slug}
                href={`/expediciones/${pkg.slug}`}
                className="group block rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Card image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <DifficultyBadge difficulty={pkg.difficulty} size="sm" />
                  </div>
                  <div className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                    {pkg.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="font-heading font-bold text-lg text-slate-900 group-hover:text-forest-700 transition-colors">
                    {pkg.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {pkg.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mountain className="h-3 w-3" aria-hidden="true" />
                      {pkg.altitude.toLocaleString("es-MX")} msnm
                    </span>
                    <span>
                      {pkg.duration.days} {pkg.duration.days === 1 ? "dia" : "dias"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p>
                      <span className="text-xs text-slate-500">Desde </span>
                      <span className="text-lg font-heading font-bold text-slate-900">
                        {formatPrice(pkg.pricePerPerson, pkg.currency)}
                      </span>
                    </p>
                    <span className="flex items-center gap-1 text-sm font-semibold text-summit-600 group-hover:text-summit-700 transition-colors">
                      {locale === "en" ? "See details" : "Ver detalles"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
