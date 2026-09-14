import { Check, X, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncludesExcludesProps {
  included: string[];
  notIncluded: string[];
}

export default function IncludesExcludes({
  included,
  notIncluded,
}: IncludesExcludesProps) {
  return (
    <section aria-label="Que incluye y que no incluye" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl mb-8 flex items-center gap-2">
          <PackageCheck className="h-6 w-6 text-forest-700 md:h-7 md:w-7" aria-hidden="true" />
          Detalles del paquete
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Included */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="flex items-center gap-2 text-lg font-heading font-bold text-emerald-800 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              Que incluye
            </h3>
            <ul className="space-y-3" role="list">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not included */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
            <h3 className="flex items-center gap-2 text-lg font-heading font-bold text-red-800 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <X className="h-5 w-5 text-red-600" aria-hidden="true" />
              </div>
              Que no incluye
            </h3>
            <ul className="space-y-3" role="list">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <X className="h-3 w-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
