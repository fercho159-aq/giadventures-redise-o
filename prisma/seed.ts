import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expeditions = [
  {
    titleEs: "La Malinche",
    titleEn: "La Malinche",
    slug: "la-malinche",
    subtitleEs: "La montaña perfecta para iniciarse en el alpinismo",
    subtitleEn: "The perfect mountain to start mountaineering",
    excerptEs: "Ascenso al volcán La Malinche, ideal para principiantes con guías certificados.",
    excerptEn: "Ascent to La Malinche volcano, ideal for beginners with certified guides.",
    descriptionEs: "La Malinche (4,461 msnm) es un volcán inactivo ubicado en los estados de Tlaxcala y Puebla. Es una excelente opción para quienes desean iniciar en el mundo del alpinismo. La ruta es clara y bien marcada, con pendientes moderadas que permiten disfrutar del paisaje mientras se asciende. Durante la expedición, nuestros guías certificados te acompañarán en todo momento, enseñándote técnicas básicas de montañismo y seguridad en alta montaña.",
    descriptionEn: "La Malinche (4,461 masl) is an inactive volcano located in the states of Tlaxcala and Puebla. It is an excellent option for those who want to start in the world of mountaineering. The route is clear and well marked, with moderate slopes that allow you to enjoy the landscape while ascending.",
    mainImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    difficulty: "principiante",
    altitude: 4461,
    durationDays: 1,
    durationNights: 0,
    groupSizeMin: 4,
    groupSizeMax: 15,
    locationName: "Tlaxcala/Puebla, México",
    locationLat: 19.2312,
    locationLng: -98.0321,
    pricePerPerson: 1800,
    currency: "MXN",
    category: "principiante",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
    requirementsEs: "Buena condición física general. No se requiere experiencia previa en montañismo.",
    requirementsEn: "Good general physical condition. No previous mountaineering experience required.",
    whatToBringEs: "Botas de senderismo, ropa térmica en capas, impermeable, mochila de 20-30L, 2 litros de agua, snacks energéticos, protector solar, lentes de sol.",
    whatToBringEn: "Hiking boots, thermal layered clothing, waterproof jacket, 20-30L backpack, 2 liters of water, energy snacks, sunscreen, sunglasses.",
    itinerary: [
      { dayNumber: 1, titleEs: "Ascenso y cumbre", titleEn: "Ascent and summit", descriptionEs: "Salida a las 5:00 AM desde el estacionamiento de La Malinche. Ascenso por la ruta normal con paradas para aclimatación. Llegada a la cumbre aproximadamente a las 11:00 AM. Descenso por la misma ruta.", descriptionEn: "Departure at 5:00 AM from La Malinche parking lot. Ascent via normal route with acclimatization stops. Summit arrival approximately at 11:00 AM. Descent via same route.", elevation: 4461 },
    ],
    includedItems: [
      { textEs: "Guía certificado", textEn: "Certified guide", icon: "Shield", isIncluded: true },
      { textEs: "Transporte desde CDMX", textEn: "Transport from Mexico City", icon: "Bus", isIncluded: true },
      { textEs: "Seguro de montaña", textEn: "Mountain insurance", icon: "Heart", isIncluded: true },
      { textEs: "Equipo técnico (crampones, piolet)", textEn: "Technical equipment (crampons, ice axe)", icon: "Wrench", isIncluded: true },
      { textEs: "Alimentación", textEn: "Food", icon: "Utensils", isIncluded: false },
      { textEs: "Equipo personal", textEn: "Personal equipment", icon: "Backpack", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80", altText: "La Malinche vista panorámica", sortOrder: 0 },
      { imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", altText: "Sendero de La Malinche", sortOrder: 1 },
    ],
  },
  {
    titleEs: "Nevado de Toluca",
    titleEn: "Nevado de Toluca",
    slug: "nevado-de-toluca",
    subtitleEs: "Volcán con lagunas de cráter espectaculares",
    subtitleEn: "Volcano with spectacular crater lakes",
    excerptEs: "Expedición al Nevado de Toluca con sus icónicas lagunas del Sol y la Luna.",
    excerptEn: "Expedition to Nevado de Toluca with its iconic Sun and Moon lagoons.",
    descriptionEs: "El Nevado de Toluca (4,680 msnm) es el cuarto volcán más alto de México. Su cráter alberga las famosas lagunas del Sol y la Luna, creando un paisaje único. Esta expedición es ideal para quienes buscan su primera experiencia en alta montaña con un nivel de dificultad accesible.",
    descriptionEn: "Nevado de Toluca (4,680 masl) is the fourth highest volcano in Mexico. Its crater hosts the famous Sun and Moon lagoons, creating a unique landscape.",
    mainImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
    difficulty: "principiante",
    altitude: 4680,
    durationDays: 1,
    durationNights: 0,
    groupSizeMin: 4,
    groupSizeMax: 15,
    locationName: "Estado de México, México",
    locationLat: 19.1084,
    locationLng: -99.7578,
    pricePerPerson: 2200,
    currency: "MXN",
    category: "principiante",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
    requirementsEs: "Buena condición física. No se requiere experiencia previa.",
    requirementsEn: "Good physical condition. No previous experience required.",
    whatToBringEs: "Botas de senderismo, ropa térmica, impermeable, mochila, agua, snacks, protector solar.",
    whatToBringEn: "Hiking boots, thermal clothing, waterproof jacket, backpack, water, snacks, sunscreen.",
    itinerary: [
      { dayNumber: 1, titleEs: "Ascenso al cráter", titleEn: "Crater ascent", descriptionEs: "Salida temprana desde CDMX. Ascenso al cráter del Nevado de Toluca. Visita a las lagunas del Sol y la Luna. Cumbre y descenso.", descriptionEn: "Early departure from Mexico City. Ascent to Nevado de Toluca crater. Visit to Sun and Moon lagoons. Summit and descent.", elevation: 4680 },
    ],
    includedItems: [
      { textEs: "Guía certificado", textEn: "Certified guide", icon: "Shield", isIncluded: true },
      { textEs: "Transporte desde CDMX", textEn: "Transport from Mexico City", icon: "Bus", isIncluded: true },
      { textEs: "Seguro de montaña", textEn: "Mountain insurance", icon: "Heart", isIncluded: true },
      { textEs: "Alimentación", textEn: "Food", icon: "Utensils", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80", altText: "Nevado de Toluca", sortOrder: 0 },
    ],
  },
  {
    titleEs: "Iztaccíhuatl",
    titleEn: "Iztaccíhuatl",
    slug: "iztaccihuatl",
    subtitleEs: "La mujer dormida - clásico del alpinismo mexicano",
    subtitleEn: "The sleeping woman - Mexican mountaineering classic",
    excerptEs: "Expedición de 2 días al Iztaccíhuatl, la tercera montaña más alta de México.",
    excerptEn: "2-day expedition to Iztaccíhuatl, Mexico's third highest mountain.",
    descriptionEs: "El Iztaccíhuatl (5,230 msnm) es la tercera montaña más alta de México y una de las más emblemáticas del alpinismo nacional. Esta expedición de dos días incluye campamento en alta montaña y ascenso a la cumbre por la ruta clásica de los Rodillos.",
    descriptionEn: "Iztaccíhuatl (5,230 masl) is Mexico's third highest mountain and one of the most iconic in national mountaineering.",
    mainImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    difficulty: "avanzado",
    altitude: 5230,
    durationDays: 2,
    durationNights: 1,
    groupSizeMin: 3,
    groupSizeMax: 10,
    locationName: "Estado de México/Puebla, México",
    locationLat: 19.1789,
    locationLng: -98.6417,
    pricePerPerson: 4500,
    currency: "MXN",
    category: "avanzado",
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
    requirementsEs: "Experiencia previa en montañismo. Excelente condición física. Haber ascendido al menos una montaña de 4,000+ msnm.",
    requirementsEn: "Previous mountaineering experience. Excellent physical condition. Must have climbed at least one 4,000+ masl mountain.",
    whatToBringEs: "Botas de alta montaña, crampones, piolet, casco, ropa térmica, sleeping bag -15°C, mochila 50L.",
    whatToBringEn: "High mountain boots, crampons, ice axe, helmet, thermal clothing, -15°C sleeping bag, 50L backpack.",
    itinerary: [
      { dayNumber: 1, titleEs: "Aproximación y campamento", titleEn: "Approach and camp", descriptionEs: "Traslado al inicio de ruta. Caminata de aproximación hasta el campamento a 4,800 msnm. Preparación de equipo y descanso temprano.", descriptionEn: "Transfer to trailhead. Approach hike to camp at 4,800 masl. Equipment preparation and early rest.", elevation: 4800 },
      { dayNumber: 2, titleEs: "Cumbre y descenso", titleEn: "Summit and descent", descriptionEs: "Salida a las 2:00 AM. Ascenso por la ruta de los Rodillos. Cumbre aproximadamente a las 8:00 AM. Descenso completo hasta el estacionamiento.", descriptionEn: "Departure at 2:00 AM. Ascent via Rodillos route. Summit approximately at 8:00 AM. Complete descent to parking lot.", elevation: 5230 },
    ],
    includedItems: [
      { textEs: "Guía certificado", textEn: "Certified guide", icon: "Shield", isIncluded: true },
      { textEs: "Transporte desde CDMX", textEn: "Transport from Mexico City", icon: "Bus", isIncluded: true },
      { textEs: "Seguro de montaña", textEn: "Mountain insurance", icon: "Heart", isIncluded: true },
      { textEs: "Equipo de campamento", textEn: "Camping equipment", icon: "Tent", isIncluded: true },
      { textEs: "Alimentación en montaña", textEn: "Mountain meals", icon: "Utensils", isIncluded: true },
      { textEs: "Equipo personal técnico", textEn: "Personal technical equipment", icon: "Backpack", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80", altText: "Iztaccíhuatl", sortOrder: 0 },
    ],
  },
  {
    titleEs: "Pico de Orizaba",
    titleEn: "Pico de Orizaba",
    slug: "pico-de-orizaba",
    subtitleEs: "La montaña más alta de México",
    subtitleEn: "Mexico's highest mountain",
    excerptEs: "Expedición al Pico de Orizaba (5,636 msnm), el techo de México.",
    excerptEn: "Expedition to Pico de Orizaba (5,636 masl), Mexico's highest peak.",
    descriptionEs: "El Pico de Orizaba o Citlaltépetl (5,636 msnm) es la montaña más alta de México y la tercera de Norteamérica. Esta expedición de tres días es el reto máximo del alpinismo mexicano, requiriendo técnicas de glaciar y excelente preparación física.",
    descriptionEn: "Pico de Orizaba or Citlaltépetl (5,636 masl) is Mexico's highest mountain and North America's third highest.",
    mainImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    difficulty: "alto-rendimiento",
    altitude: 5636,
    durationDays: 3,
    durationNights: 2,
    groupSizeMin: 2,
    groupSizeMax: 8,
    locationName: "Puebla/Veracruz, México",
    locationLat: 19.0303,
    locationLng: -97.2683,
    pricePerPerson: 7500,
    currency: "MXN",
    category: "alto-rendimiento",
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
    requirementsEs: "Amplia experiencia en alpinismo. Excelente condición física. Haber ascendido al Iztaccíhuatl o equivalente.",
    requirementsEn: "Extensive mountaineering experience. Excellent physical condition. Must have climbed Iztaccíhuatl or equivalent.",
    whatToBringEs: "Botas dobles de alta montaña, crampones técnicos, piolet, casco, arnés, ropa para -20°C, sleeping bag -25°C.",
    whatToBringEn: "Double high mountain boots, technical crampons, ice axe, helmet, harness, clothing for -20°C, -25°C sleeping bag.",
    itinerary: [
      { dayNumber: 1, titleEs: "Traslado y aclimatación", titleEn: "Transfer and acclimatization", descriptionEs: "Traslado desde CDMX al refugio Piedra Grande (4,260 msnm). Caminata de aclimatación. Revisión de equipo.", descriptionEn: "Transfer from Mexico City to Piedra Grande shelter (4,260 masl). Acclimatization hike. Equipment review.", elevation: 4260 },
      { dayNumber: 2, titleEs: "Ascenso al campamento alto", titleEn: "High camp ascent", descriptionEs: "Ascenso al campamento alto a 4,900 msnm. Práctica de técnicas de glaciar. Preparación para cumbre.", descriptionEn: "Ascent to high camp at 4,900 masl. Glacier technique practice. Summit preparation.", elevation: 4900 },
      { dayNumber: 3, titleEs: "Cumbre y descenso", titleEn: "Summit and descent", descriptionEs: "Salida a la 1:00 AM. Ascenso por el glaciar de Jamapa. Cumbre. Descenso completo hasta Piedra Grande. Traslado de regreso.", descriptionEn: "Departure at 1:00 AM. Ascent via Jamapa glacier. Summit. Complete descent to Piedra Grande. Return transfer.", elevation: 5636 },
    ],
    includedItems: [
      { textEs: "Guía de alta montaña certificado", textEn: "Certified high mountain guide", icon: "Shield", isIncluded: true },
      { textEs: "Transporte ida y vuelta", textEn: "Round trip transport", icon: "Bus", isIncluded: true },
      { textEs: "Seguro de montaña", textEn: "Mountain insurance", icon: "Heart", isIncluded: true },
      { textEs: "Refugio y campamento", textEn: "Shelter and camp", icon: "Tent", isIncluded: true },
      { textEs: "Alimentación completa", textEn: "Full meals", icon: "Utensils", isIncluded: true },
      { textEs: "Equipo técnico personal", textEn: "Personal technical equipment", icon: "Backpack", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", altText: "Pico de Orizaba", sortOrder: 0 },
    ],
  },
  {
    titleEs: "Cotopaxi, Ecuador",
    titleEn: "Cotopaxi, Ecuador",
    slug: "cotopaxi",
    subtitleEs: "Uno de los volcanes activos más altos del mundo",
    subtitleEn: "One of the highest active volcanoes in the world",
    excerptEs: "Expedición internacional al Cotopaxi (5,897 msnm) en Ecuador.",
    excerptEn: "International expedition to Cotopaxi (5,897 masl) in Ecuador.",
    descriptionEs: "El Cotopaxi (5,897 msnm) es uno de los volcanes activos más altos del mundo, ubicado en la Cordillera de los Andes en Ecuador. Esta expedición de 5 días incluye aclimatación progresiva y ascenso por glaciar.",
    descriptionEn: "Cotopaxi (5,897 masl) is one of the highest active volcanoes in the world, located in the Andes Mountains in Ecuador.",
    mainImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    difficulty: "alto-rendimiento",
    altitude: 5897,
    durationDays: 5,
    durationNights: 4,
    groupSizeMin: 2,
    groupSizeMax: 6,
    locationName: "Cotopaxi, Ecuador",
    locationLat: -0.6838,
    locationLng: -78.4378,
    pricePerPerson: 25000,
    currency: "MXN",
    category: "internacional",
    isFeatured: true,
    isActive: true,
    sortOrder: 5,
    requirementsEs: "Experiencia comprobada en alta montaña (5,000+ msnm). Pasaporte vigente. Excelente condición física.",
    requirementsEn: "Proven high altitude experience (5,000+ masl). Valid passport. Excellent physical condition.",
    whatToBringEs: "Botas dobles, crampones, piolet, casco, arnés, ropa para -25°C, sleeping bag -30°C, pasaporte.",
    whatToBringEn: "Double boots, crampons, ice axe, helmet, harness, clothing for -25°C, -30°C sleeping bag, passport.",
    itinerary: [
      { dayNumber: 1, titleEs: "Llegada a Quito", titleEn: "Arrival in Quito", descriptionEs: "Recepción en aeropuerto. Traslado al hotel. Briefing de la expedición.", descriptionEn: "Airport reception. Hotel transfer. Expedition briefing.", elevation: 2850 },
      { dayNumber: 2, titleEs: "Aclimatación", titleEn: "Acclimatization", descriptionEs: "Caminata de aclimatación en los alrededores de Quito. Visita al mercado local.", descriptionEn: "Acclimatization hike around Quito. Local market visit.", elevation: 3500 },
      { dayNumber: 3, titleEs: "Traslado al refugio", titleEn: "Transfer to shelter", descriptionEs: "Traslado al Parque Nacional Cotopaxi. Ascenso al refugio José Rivas (4,800 msnm).", descriptionEn: "Transfer to Cotopaxi National Park. Ascent to José Rivas shelter (4,800 masl).", elevation: 4800 },
      { dayNumber: 4, titleEs: "Cumbre", titleEn: "Summit", descriptionEs: "Salida a medianoche. Ascenso por glaciar. Cumbre al amanecer. Descenso al refugio y traslado.", descriptionEn: "Midnight departure. Glacier ascent. Dawn summit. Descent to shelter and transfer.", elevation: 5897 },
      { dayNumber: 5, titleEs: "Regreso", titleEn: "Return", descriptionEs: "Día libre en Quito. Traslado al aeropuerto.", descriptionEn: "Free day in Quito. Airport transfer.", elevation: 2850 },
    ],
    includedItems: [
      { textEs: "Guías internacionales certificados", textEn: "Certified international guides", icon: "Shield", isIncluded: true },
      { textEs: "Alojamiento completo", textEn: "Full accommodation", icon: "Hotel", isIncluded: true },
      { textEs: "Alimentación completa", textEn: "Full meals", icon: "Utensils", isIncluded: true },
      { textEs: "Transporte terrestre en Ecuador", textEn: "Ground transport in Ecuador", icon: "Bus", isIncluded: true },
      { textEs: "Seguro de montaña internacional", textEn: "International mountain insurance", icon: "Heart", isIncluded: true },
      { textEs: "Vuelos internacionales", textEn: "International flights", icon: "Plane", isIncluded: false },
      { textEs: "Equipo personal técnico", textEn: "Personal technical equipment", icon: "Backpack", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", altText: "Cotopaxi", sortOrder: 0 },
    ],
  },
  {
    titleEs: "Alpamayo, Perú",
    titleEn: "Alpamayo, Peru",
    slug: "alpamayo",
    subtitleEs: "La montaña más bella del mundo",
    subtitleEn: "The most beautiful mountain in the world",
    excerptEs: "Expedición al Alpamayo (5,947 msnm), considerada la montaña más bella del mundo.",
    excerptEn: "Expedition to Alpamayo (5,947 masl), considered the most beautiful mountain in the world.",
    descriptionEs: "El Alpamayo (5,947 msnm) fue votada como la montaña más bella del mundo por su perfecta forma piramidal de hielo. Ubicada en la Cordillera Blanca de Perú, esta expedición de 12 días es una aventura de alto nivel técnico.",
    descriptionEn: "Alpamayo (5,947 masl) was voted the most beautiful mountain in the world for its perfect pyramidal ice shape.",
    mainImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    difficulty: "alto-rendimiento",
    altitude: 5947,
    durationDays: 12,
    durationNights: 11,
    groupSizeMin: 2,
    groupSizeMax: 5,
    locationName: "Cordillera Blanca, Perú",
    locationLat: -8.8792,
    locationLng: -77.6536,
    pricePerPerson: 45000,
    currency: "MXN",
    category: "internacional",
    isFeatured: true,
    isActive: true,
    sortOrder: 6,
    requirementsEs: "Experiencia en alpinismo técnico y glaciar. Haber ascendido montañas de 5,500+ msnm. Pasaporte vigente.",
    requirementsEn: "Technical and glacier mountaineering experience. Must have climbed 5,500+ masl mountains. Valid passport.",
    whatToBringEs: "Equipo completo de alpinismo técnico, ropa para -30°C, sleeping bag -35°C, pasaporte.",
    whatToBringEn: "Full technical mountaineering equipment, clothing for -30°C, -35°C sleeping bag, passport.",
    itinerary: [
      { dayNumber: 1, titleEs: "Llegada a Lima", titleEn: "Arrival in Lima", descriptionEs: "Recepción. Traslado al hotel.", descriptionEn: "Reception. Hotel transfer.", elevation: 150 },
      { dayNumber: 2, titleEs: "Traslado a Huaraz", titleEn: "Transfer to Huaraz", descriptionEs: "Viaje en bus a Huaraz (3,090 msnm). Aclimatación.", descriptionEn: "Bus trip to Huaraz (3,090 masl). Acclimatization.", elevation: 3090 },
      { dayNumber: 3, titleEs: "Aclimatación activa", titleEn: "Active acclimatization", descriptionEs: "Caminata de aclimatación en la Laguna 69.", descriptionEn: "Acclimatization hike to Laguna 69.", elevation: 4600 },
    ],
    includedItems: [
      { textEs: "Guías UIAGM certificados", textEn: "IFMGA certified guides", icon: "Shield", isIncluded: true },
      { textEs: "Alojamiento completo", textEn: "Full accommodation", icon: "Hotel", isIncluded: true },
      { textEs: "Alimentación completa", textEn: "Full meals", icon: "Utensils", isIncluded: true },
      { textEs: "Porteadores y mulas", textEn: "Porters and mules", icon: "Users", isIncluded: true },
      { textEs: "Vuelos internacionales", textEn: "International flights", icon: "Plane", isIncluded: false },
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80", altText: "Alpamayo", sortOrder: 0 },
    ],
  },
];

// Sample departure dates (YYYY-MM-DD start/end) so bookings can be tested
const sampleDates: Record<string, [string, string][]> = {
  "la-malinche": [["2026-10-12", "2026-10-12"], ["2026-11-02", "2026-11-02"], ["2026-12-07", "2026-12-07"]],
  "nevado-de-toluca": [["2026-10-05", "2026-10-05"], ["2026-10-19", "2026-10-19"], ["2026-11-16", "2026-11-16"]],
  iztaccihuatl: [["2026-10-18", "2026-10-19"], ["2026-11-08", "2026-11-09"], ["2026-12-13", "2026-12-14"]],
  "pico-de-orizaba": [["2026-11-14", "2026-11-16"], ["2026-12-12", "2026-12-14"], ["2027-01-09", "2027-01-11"]],
  cotopaxi: [["2027-02-15", "2027-02-19"], ["2027-04-12", "2027-04-16"]],
  alpamayo: [["2027-06-20", "2027-07-01"]],
};

async function main() {
  console.log("Seeding database...");

  let createdCount = 0;
  for (const exp of expeditions) {
    const { itinerary, includedItems, gallery, ...data } = exp;

    const existing = await prisma.expedition.findUnique({ where: { slug: data.slug } });
    if (existing) {
      console.log(`  Skipped (already exists): ${data.titleEs} (${data.slug})`);
      continue;
    }

    const dates = (sampleDates[data.slug] ?? []).map(([start, end]) => ({
      startDate: new Date(`${start}T00:00:00.000Z`),
      endDate: new Date(`${end}T00:00:00.000Z`),
      spotsTotal: data.groupSizeMax,
      spotsTaken: 0,
      status: "available",
    }));

    const created = await prisma.expedition.create({
      data: {
        ...data,
        itinerary: { create: itinerary },
        includedItems: { create: includedItems },
        gallery: { create: gallery },
        dates: { create: dates },
      },
    });
    createdCount++;

    console.log(`  Created: ${created.titleEs} (${created.slug})`);
  }

  console.log(`\nDone! ${createdCount} expeditions seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
