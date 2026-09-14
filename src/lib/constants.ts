export const SITE_NAME = 'Adventures GI';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adventuresgi.com';
export const WHATSAPP_NUMBER = '525612078989';
export const WHATSAPP_LINK = 'https://wa.me/525612078989';
export const CONTACT_EMAIL = 'contacto@adventuresgi.com';
export const CONTACT_PHONE = '+52 56 1207 8989';
export const INSTAGRAM_URL = 'https://instagram.com/adventures_gi';
export const INSTAGRAM_ALPINE_URL = 'https://instagram.com/gi.alpine';
export const TIKTOK_URL = 'https://tiktok.com/@adventuresgigi';
export const CEO_NAME = 'Giovanna Venegas Rangel';

export const NAV_LINKS = [
  { href: '/expediciones', labelKey: 'expeditions' },
  { href: '/nosotros', labelKey: 'about' },
  { href: '/galeria', labelKey: 'gallery' },
  { href: '/contacto', labelKey: 'contact' },
] as const;

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const DIFFICULTY_COLORS = {
  principiante: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  intermedio: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
  avanzado: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  'alto-rendimiento': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
} as const;

export const COUNTRIES = ['México', 'Ecuador', 'Perú', 'Canadá'] as const;
