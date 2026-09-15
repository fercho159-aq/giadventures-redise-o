import type { Expedition } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import type { PriceTierLike } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Public-site data access for expeditions (a.k.a. packages).
// Admin writes to the same tables, so edits show up here immediately.
// ---------------------------------------------------------------------------

export type Difficulty = keyof typeof DIFFICULTY_COLORS;

type Lang = "es" | "en";

function toLang(locale: string): Lang {
  return locale === "en" ? "en" : "es";
}

/** Localized text with fallback to Spanish when the English field is empty. */
function loc(es: string | null | undefined, en: string | null | undefined, lang: Lang): string {
  if (lang === "en" && en && en.trim()) return en;
  return es ?? "";
}

export function toDifficulty(value: string): Difficulty {
  return value in DIFFICULTY_COLORS ? (value as Difficulty) : "principiante";
}

/** "YYYY-MM-DD" for a calendar date stored at UTC midnight. */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Country is the last comma-separated part of the location, e.g. "Cotopaxi, Ecuador". */
function countryFromLocation(locationName: string | null): string {
  if (!locationName) return "México";
  const parts = locationName.split(",");
  return parts[parts.length - 1].trim() || "México";
}

export function formatDuration(days: number, nights: number, locale: string): string {
  const lang = toLang(locale);
  const d = lang === "en" ? (days === 1 ? "day" : "days") : days === 1 ? "día" : "días";
  if (!nights) return `${days} ${d}`;
  const n = lang === "en" ? (nights === 1 ? "night" : "nights") : nights === 1 ? "noche" : "noches";
  return `${days} ${d} / ${nights} ${n}`;
}

// ---------------------------------------------------------------------------
// Cards (home + listing)
// ---------------------------------------------------------------------------

export interface ExpeditionCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  difficulty: Difficulty;
  pricePerPerson: number;
  currency: string;
  altitude: number | null;
  durationDays: number;
  durationNights: number;
  duration: string;
  location: string;
  country: string;
  image: string | null;
  category: string | null;
}

function toCard(row: Expedition, locale: string): ExpeditionCard {
  const lang = toLang(locale);
  return {
    id: row.id,
    slug: row.slug,
    title: loc(row.titleEs, row.titleEn, lang),
    excerpt: loc(row.excerptEs, row.excerptEn, lang),
    difficulty: toDifficulty(row.difficulty),
    pricePerPerson: row.pricePerPerson,
    currency: row.currency,
    altitude: row.altitude,
    durationDays: row.durationDays,
    durationNights: row.durationNights,
    duration: formatDuration(row.durationDays, row.durationNights, locale),
    location: row.locationName ?? "",
    country: countryFromLocation(row.locationName),
    image: row.mainImage,
    category: row.category,
  };
}

const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];

export async function getActiveExpeditions(locale: string): Promise<ExpeditionCard[]> {
  try {
    const rows = await prisma.expedition.findMany({
      where: { isActive: true },
      orderBy: ORDER,
    });
    return rows.map((r) => toCard(r, locale));
  } catch (error) {
    console.error("[expeditions] getActiveExpeditions", error);
    return [];
  }
}

export async function getFeaturedExpeditions(locale: string): Promise<ExpeditionCard[]> {
  try {
    const rows = await prisma.expedition.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: ORDER,
    });
    return rows.map((r) => toCard(r, locale));
  } catch (error) {
    console.error("[expeditions] getFeaturedExpeditions", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Detail page
// ---------------------------------------------------------------------------

export interface AvailableDate {
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsTaken: number;
  status: "available" | "full" | "guaranteed";
}

export interface ExpeditionDetail extends ExpeditionCard {
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string | null;
  groupSizeMin: number | null;
  groupSizeMax: number | null;
  requirements: string;
  whatToBring: string;
  itinerary: { dayNumber: number; title: string; description: string; elevation?: number }[];
  included: string[];
  notIncluded: string[];
  gallery: { type: "image" | "video"; src: string; alt: string; caption?: string }[];
  dates: AvailableDate[];
  priceTiers: PriceTierLike[];
}

function toDateStatus(date: { status: string; spotsTotal: number; spotsTaken: number }): AvailableDate["status"] {
  if (date.status === "full" || date.spotsTaken >= date.spotsTotal) return "full";
  if (date.status === "guaranteed") return "guaranteed";
  return "available";
}

export async function getExpeditionBySlug(
  slug: string,
  locale: string
): Promise<ExpeditionDetail | null> {
  const lang = toLang(locale);
  const row = await prisma.expedition.findFirst({
    where: { slug, isActive: true },
    include: {
      itinerary: { orderBy: { dayNumber: "asc" } },
      gallery: { orderBy: { sortOrder: "asc" } },
      includedItems: true,
      dates: {
        where: { startDate: { gte: startOfTodayUtc() } },
        orderBy: { startDate: "asc" },
      },
      priceTiers: { orderBy: { minPeople: "asc" } },
    },
  });
  if (!row) return null;

  const card = toCard(row, locale);

  const gallery: ExpeditionDetail["gallery"] = row.gallery.map((g, i) => ({
    type: g.type === "video" ? "video" : "image",
    src: g.imageUrl,
    alt: g.altText || `${card.title} ${i + 1}`,
    caption: loc(g.captionEs, g.captionEn, lang) || undefined,
  }));
  if (gallery.length === 0 && row.mainImage) {
    gallery.push({ type: "image", src: row.mainImage, alt: card.title });
  }

  return {
    ...card,
    subtitle: loc(row.subtitleEs, row.subtitleEn, lang),
    description: loc(row.descriptionEs, row.descriptionEn, lang),
    seoTitle: loc(row.seoTitleEs, row.seoTitleEn, lang),
    seoDescription: loc(row.seoDescriptionEs, row.seoDescriptionEn, lang),
    seoImage: row.seoImage,
    groupSizeMin: row.groupSizeMin,
    groupSizeMax: row.groupSizeMax,
    requirements: loc(row.requirementsEs, row.requirementsEn, lang),
    whatToBring: loc(row.whatToBringEs, row.whatToBringEn, lang),
    itinerary: row.itinerary.map((d) => ({
      dayNumber: d.dayNumber,
      title: loc(d.titleEs, d.titleEn, lang),
      description: loc(d.descriptionEs, d.descriptionEn, lang),
      elevation: d.elevation ?? undefined,
    })),
    included: row.includedItems.filter((i) => i.isIncluded).map((i) => loc(i.textEs, i.textEn, lang)),
    notIncluded: row.includedItems.filter((i) => !i.isIncluded).map((i) => loc(i.textEs, i.textEn, lang)),
    gallery,
    dates: row.dates.map((d) => ({
      startDate: toDateKey(d.startDate),
      endDate: toDateKey(d.endDate),
      spotsTotal: d.spotsTotal,
      spotsTaken: d.spotsTaken,
      status: toDateStatus(d),
    })),
    priceTiers: row.priceTiers.map((t) => ({
      minPeople: t.minPeople,
      maxPeople: t.maxPeople,
      pricePerPerson: t.pricePerPerson,
    })),
  };
}

/** Other active expeditions, same category first. */
export async function getRelatedExpeditions(
  current: { id: string; category: string | null },
  locale: string,
  limit = 3
): Promise<ExpeditionCard[]> {
  const all = await getActiveExpeditions(locale);
  const others = all.filter((e) => e.id !== current.id);
  const sameCategory = others.filter((e) => current.category && e.category === current.category);
  const rest = others.filter((e) => !sameCategory.includes(e));
  return [...sameCategory, ...rest].slice(0, limit);
}
