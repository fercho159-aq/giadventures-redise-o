"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LOCALES } from "@/lib/constants";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitch(newLocale: string) {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden" role="group" aria-label="Language switcher">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          aria-pressed={locale === loc}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold transition-colors",
            locale === loc
              ? "bg-forest-700 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
