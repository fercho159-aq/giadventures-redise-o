import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string, locale: string = 'es'): string {
  // Dates are calendar days stored at UTC midnight; format in UTC so the day
  // doesn't shift in Mexico time (and server/client output matches).
  return new Date(date).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export interface PriceTierLike {
  minPeople: number;
  maxPeople: number;
  pricePerPerson: number;
}

/** Price per person for a group size, using a matching price tier when one exists. */
export function getUnitPrice(
  basePrice: number,
  tiers: PriceTierLike[] | undefined,
  people: number
): number {
  const tier = tiers?.find((t) => people >= t.minPeople && people <= t.maxPeople);
  return tier ? tier.pricePerPerson : basePrice;
}
