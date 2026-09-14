import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  PackageHero,
  MediaGallery,
  ItineraryTimeline,
  IncludesExcludes,
  PricingCard,
  PackageReviews,
  RelatedPackages,
} from "@/components/package-detail";
import type { DIFFICULTY_COLORS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  TypeScript interfaces                                              */
/* ------------------------------------------------------------------ */

interface LocalizedString {
  es: string;
  en: string;
}

interface Duration {
  days: number;
  nights: number;
}

interface GroupSize {
  min: number;
  max: number;
}

interface Location {
  name: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  elevation?: number;
}

interface AvailableDate {
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsTaken: number;
  status: "available" | "full" | "guaranteed";
}

interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  videoUrl?: string;
  placeholderColor?: string;
}

interface Review {
  author: string;
  date: string;
  rating: number;
  text: string;
  expedition: string;
}

interface RelatedPackage {
  slug: string;
  title: string;
  difficulty: keyof typeof DIFFICULTY_COLORS;
  pricePerPerson: number;
  currency: string;
  altitude: number;
  duration: Duration;
  placeholderColor: string;
}

interface Package {
  title: LocalizedString;
  slug: string;
  subtitle: LocalizedString;
  excerpt: LocalizedString;
  description: LocalizedString;
  mainImageAlt: string;
  duration: Duration;
  difficulty: keyof typeof DIFFICULTY_COLORS;
  altitude: number;
  groupSize: GroupSize;
  location: Location;
  pricePerPerson: number;
  currency: string;
  availableDates: AvailableDate[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  gallery: GalleryItem[];
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  relatedPackages: RelatedPackage[];
  isFeatured: boolean;
  isActive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data: Pico de Orizaba                                         */
/* ------------------------------------------------------------------ */

const MOCK_PACKAGE: Package = {
  title: {
    es: "Pico de Orizaba",
    en: "Pico de Orizaba",
  },
  slug: "pico-de-orizaba",
  subtitle: {
    es: "Conquista la montana mas alta de Mexico",
    en: "Conquer the highest mountain in Mexico",
  },
  excerpt: {
    es: "Expedicion de 3 dias al Pico de Orizaba (5,636 msnm), la montana mas alta de Mexico y tercer volcan mas alto de Norteamerica. Incluye guia certificado, equipo tecnico y transporte.",
    en: "3-day expedition to Pico de Orizaba (5,636 masl), the highest mountain in Mexico and third highest volcano in North America. Includes certified guide, technical equipment and transportation.",
  },
  description: {
    es: "El Pico de Orizaba, tambien conocido como Citlaltepetl ('Montana de la Estrella' en nahuatl), es un estratovolcan inactivo y la montana mas alta de Mexico con 5,636 metros sobre el nivel del mar. Es tambien el tercer volcan mas alto de Norteamerica.\n\nEsta expedicion esta disenada para alpinistas con experiencia previa en alta montana. El ascenso se realiza por la ruta del Glaciar de Jamapa, la via clasica y mas popular. La expedicion incluye un dia de aclimatacion en Tlachichuca, ascenso al refugio de Piedra Grande (4,260m) y el intento de cumbre que comienza en la madrugada.\n\nNuestros guias certificados te acompanaran durante toda la expedicion, proporcionando equipo tecnico especializado y asegurando una experiencia segura e inolvidable. El Pico de Orizaba ofrece vistas espectaculares del Golfo de Mexico y el altiplano central, haciendo de esta una de las expediciones mas gratificantes de Mexico.",
    en: "Pico de Orizaba, also known as Citlaltepetl ('Star Mountain' in Nahuatl), is an inactive stratovolcano and the highest mountain in Mexico at 5,636 meters above sea level. It is also the third highest volcano in North America.\n\nThis expedition is designed for mountaineers with previous high-altitude experience. The ascent follows the Jamapa Glacier route, the classic and most popular path. The expedition includes an acclimatization day in Tlachichuca, ascent to the Piedra Grande refuge (4,260m), and the summit attempt that begins in the early morning hours.\n\nOur certified guides will accompany you throughout the expedition, providing specialized technical equipment and ensuring a safe and unforgettable experience. Pico de Orizaba offers spectacular views of the Gulf of Mexico and the central highlands, making this one of Mexico's most rewarding expeditions.",
  },
  mainImageAlt: "Vista del Pico de Orizaba al amanecer con el glaciar de Jamapa",
  duration: { days: 3, nights: 2 },
  difficulty: "avanzado",
  altitude: 5636,
  groupSize: { min: 4, max: 10 },
  location: {
    name: "Tlachichuca, Puebla",
    country: "Mexico",
    coordinates: { lat: 19.0301, lng: -97.2677 },
  },
  pricePerPerson: 8500,
  currency: "MXN",
  availableDates: [
    {
      startDate: "2026-11-15",
      endDate: "2026-11-17",
      spotsTotal: 10,
      spotsTaken: 7,
      status: "available",
    },
    {
      startDate: "2026-12-13",
      endDate: "2026-12-15",
      spotsTotal: 10,
      spotsTaken: 5,
      status: "available",
    },
    {
      startDate: "2027-01-10",
      endDate: "2027-01-12",
      spotsTotal: 10,
      spotsTaken: 2,
      status: "guaranteed",
    },
  ],
  itinerary: [
    {
      dayNumber: 1,
      title: "Llegada a Tlachichuca y aclimatacion",
      description:
        "Nos reunimos en el punto de encuentro en CDMX temprano por la manana. Viajamos en transporte privado a Tlachichuca, Puebla (aprox. 3.5 horas). Al llegar, nos instalamos en el alojamiento y realizamos una caminata de aclimatacion por los alrededores del pueblo. Por la tarde, revision de equipo y briefing de la expedicion con el guia. Cena incluida y descanso temprano para prepararnos para el ascenso del dia siguiente.",
      elevation: 2600,
    },
    {
      dayNumber: 2,
      title: "Ascenso al refugio de Piedra Grande",
      description:
        "Despues de un desayuno energetico, nos trasladamos en vehiculo 4x4 hasta la base del volcan. Iniciamos el ascenso a pie hacia el Refugio de Piedra Grande (4,260m), una caminata de aproximadamente 4-5 horas por terreno de media montana. Al llegar al refugio, almorzamos y descansamos. Por la tarde, practicamos tecnicas con crampones y piolet en una zona segura. Cena temprana y descanso, ya que la salida a cumbre sera durante la madrugada.",
      elevation: 4260,
    },
    {
      dayNumber: 3,
      title: "Cumbre del Pico de Orizaba y descenso",
      description:
        "Salida a cumbre entre 1:00 y 2:00 AM con lampara frontal. El ascenso nocturno por el Glaciar de Jamapa toma aproximadamente 6-8 horas dependiendo de las condiciones. Al llegar a la cumbre (5,636m), disfrutamos de vistas espectaculares del amanecer sobre el Golfo de Mexico. Tras las fotos y celebracion, iniciamos el descenso hasta el refugio (aprox. 3-4 horas). Recogemos nuestro equipo y descendemos hasta el vehiculo. Regreso a CDMX por la tarde-noche.",
      elevation: 5636,
    },
  ],
  included: [
    "Transporte redondo desde CDMX",
    "Guia de montana certificado AMGA",
    "Equipo tecnico (crampones, piolet, casco, arnes)",
    "Alimentacion completa durante la expedicion",
    "Seguro de accidentes de montana",
    "Permisos de acceso al parque nacional",
    "Alojamiento en Tlachichuca y refugio",
    "Transporte 4x4 a la base del volcan",
  ],
  notIncluded: [
    "Vuelos internacionales",
    "Equipo personal (botas, ropa termica, sleeping bag)",
    "Propinas para el equipo de guias",
    "Seguro de cancelacion de viaje",
    "Comidas adicionales fuera del itinerario",
    "Alquiler de equipo personal adicional",
  ],
  gallery: [
    {
      type: "image",
      src: "",
      alt: "Cumbre del Pico de Orizaba al amanecer",
      caption: "Amanecer desde la cumbre",
      placeholderColor: "from-summit-500 to-summit-700",
    },
    {
      type: "image",
      src: "",
      alt: "Glaciar de Jamapa durante el ascenso nocturno",
      caption: "Glaciar de Jamapa",
      placeholderColor: "from-slate-600 to-slate-800",
    },
    {
      type: "image",
      src: "",
      alt: "Refugio de Piedra Grande al atardecer",
      caption: "Refugio Piedra Grande",
      placeholderColor: "from-forest-600 to-forest-800",
    },
    {
      type: "video",
      src: "",
      alt: "Video del ascenso al Pico de Orizaba",
      caption: "Ascenso en video",
      videoUrl: "https://youtube.com/watch?v=example",
      placeholderColor: "from-slate-700 to-forest-900",
    },
    {
      type: "image",
      src: "",
      alt: "Equipo de alpinistas en la cumbre",
      caption: "Equipo en la cumbre",
      placeholderColor: "from-forest-700 to-slate-800",
    },
    {
      type: "image",
      src: "",
      alt: "Vista del crater del Pico de Orizaba",
      caption: "Crater del volcan",
      placeholderColor: "from-summit-600 to-forest-700",
    },
    {
      type: "image",
      src: "",
      alt: "Practica de crampones cerca del refugio",
      caption: "Practica de crampones",
      placeholderColor: "from-slate-500 to-slate-700",
    },
    {
      type: "image",
      src: "",
      alt: "Pueblo de Tlachichuca con el volcan de fondo",
      caption: "Tlachichuca",
      placeholderColor: "from-forest-500 to-forest-700",
    },
  ],
  reviews: [
    {
      author: "Carlos Martinez",
      date: "2026-03-15",
      rating: 5,
      text: "Una experiencia increible. El guia fue muy profesional y nos hizo sentir seguros en todo momento. Llegar a la cumbre fue el momento mas emocionante de mi vida. Totalmente recomendado para cualquier alpinista con experiencia.",
      expedition: "Pico de Orizaba - Marzo 2026",
    },
    {
      author: "Ana Laura Gonzalez",
      date: "2026-01-20",
      rating: 5,
      text: "Organizacion impecable desde el transporte hasta la alimentacion. Los guias tienen un conocimiento profundo de la montana y las condiciones climaticas. El amanecer desde la cumbre es algo que no olvidare jamas.",
      expedition: "Pico de Orizaba - Enero 2026",
    },
    {
      author: "Roberto Sanchez",
      date: "2025-12-08",
      rating: 4,
      text: "Muy buena expedicion. El unico detalle fue que el clima no nos permitio ver la salida del sol desde la cumbre, pero el equipo manejo la situacion con mucha profesionalidad. El equipo proporcionado es de primera calidad.",
      expedition: "Pico de Orizaba - Diciembre 2025",
    },
    {
      author: "Maria Fernanda Lopez",
      date: "2025-11-22",
      rating: 5,
      text: "Mi tercera expedicion con Adventures GI y siempre superan las expectativas. El Pico de Orizaba es una montana exigente pero con estos guias te sientes acompanado y seguro. El briefing previo es muy completo y te preparan para cada escenario.",
      expedition: "Pico de Orizaba - Noviembre 2025",
    },
  ],
  averageRating: 4.8,
  totalReviews: 47,
  relatedPackages: [
    {
      slug: "iztaccihuatl",
      title: "Iztaccihuatl",
      difficulty: "intermedio",
      pricePerPerson: 5500,
      currency: "MXN",
      altitude: 5230,
      duration: { days: 2, nights: 1 },
      placeholderColor: "from-forest-600 to-slate-700",
    },
    {
      slug: "nevado-de-toluca",
      title: "Nevado de Toluca",
      difficulty: "principiante",
      pricePerPerson: 2800,
      currency: "MXN",
      altitude: 4680,
      duration: { days: 1, nights: 0 },
      placeholderColor: "from-slate-600 to-forest-800",
    },
    {
      slug: "cotopaxi-ecuador",
      title: "Cotopaxi, Ecuador",
      difficulty: "alto-rendimiento",
      pricePerPerson: 35000,
      currency: "MXN",
      altitude: 5897,
      duration: { days: 7, nights: 6 },
      placeholderColor: "from-summit-600 to-slate-800",
    },
  ],
  isFeatured: true,
  isActive: true,
};

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pkg = MOCK_PACKAGE;
  const lang = locale === "en" ? "en" : "es";

  return {
    title: pkg.title[lang],
    description: pkg.excerpt[lang],
    openGraph: {
      title: `${pkg.title[lang]} | Adventures GI`,
      description: pkg.excerpt[lang],
      type: "website",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pkg = MOCK_PACKAGE;
  const lang = locale === "en" ? "en" : "es";

  return (
    <main className="pb-24 lg:pb-0">
      {/* Hero */}
      <PackageHero
        title={pkg.title[lang]}
        subtitle={pkg.subtitle[lang]}
        mainImageAlt={pkg.mainImageAlt}
        duration={pkg.duration}
        altitude={pkg.altitude}
        difficulty={pkg.difficulty}
        groupSize={pkg.groupSize}
      />

      {/* Main content + sidebar layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10 xl:gap-12">
          {/* Left content column (2/3 on desktop) */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <MediaGallery items={pkg.gallery} />

            {/* Description */}
            <section aria-label="Descripcion" className="py-8 md:py-12">
              <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl mb-6">
                Acerca de esta expedicion
              </h2>
              <div className="prose prose-slate max-w-none">
                {pkg.description[lang].split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-slate-600 mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <ItineraryTimeline days={pkg.itinerary} />

            {/* Includes/Excludes */}
            <IncludesExcludes
              included={pkg.included}
              notIncluded={pkg.notIncluded}
            />

            {/* Reviews */}
            <PackageReviews
              reviews={pkg.reviews}
              averageRating={pkg.averageRating}
              totalCount={pkg.totalReviews}
            />
          </div>

          {/* Right sidebar (1/3 on desktop) */}
          <div className="lg:col-span-1">
            <PricingCard
              pricePerPerson={pkg.pricePerPerson}
              currency={pkg.currency}
              availableDates={pkg.availableDates}
              groupSizeMax={pkg.groupSize.max}
              packageName={pkg.title[lang]}
            />
          </div>
        </div>
      </div>

      {/* Related packages (full width) */}
      <RelatedPackages packages={pkg.relatedPackages} />
    </main>
  );
}
