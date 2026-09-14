"use client";

import { Mountain, MapPin } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  elevation?: number;
}

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

const AccordionContent = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string; isOpen: boolean }
>(({ children, className, isOpen }, ref) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          <div className="pb-4 pl-4 pr-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";

export default function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  const [openItems, setOpenItems] = useState<string[]>([`day-1`]);

  return (
    <section aria-label="Itinerario" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl mb-8 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-forest-700 md:h-7 md:w-7" aria-hidden="true" />
          Itinerario
        </h2>

        <Accordion.Root
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="relative"
        >
          {/* Vertical connector line */}
          <div
            className="absolute left-[23px] md:left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-forest-300 via-forest-400 to-forest-600"
            aria-hidden="true"
          />

          <div className="space-y-4">
            {days.map((day) => {
              const itemValue = `day-${day.dayNumber}`;
              const isOpen = openItems.includes(itemValue);

              return (
                <Accordion.Item key={itemValue} value={itemValue} className="relative">
                  <div className="flex gap-4 md:gap-6">
                    {/* Day number circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={cn(
                          "flex h-[48px] w-[48px] md:h-[56px] md:w-[56px] items-center justify-center rounded-full border-2 font-heading font-bold text-base md:text-lg transition-all duration-300",
                          isOpen
                            ? "bg-forest-700 border-forest-700 text-white shadow-lg shadow-forest-700/25"
                            : "bg-white border-forest-300 text-forest-700 hover:border-forest-500"
                        )}
                      >
                        {day.dayNumber}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <Accordion.Header>
                        <Accordion.Trigger
                          className={cn(
                            "group flex w-full items-start justify-between rounded-xl px-4 py-3 text-left transition-all duration-200",
                            isOpen
                              ? "bg-forest-50 shadow-sm"
                              : "hover:bg-slate-50"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-forest-600 mb-0.5">
                              Dia {day.dayNumber}
                            </span>
                            <span className="block text-base font-heading font-bold text-slate-900 md:text-lg">
                              {day.title}
                            </span>
                            {day.elevation && (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <Mountain className="h-3 w-3" aria-hidden="true" />
                                {day.elevation.toLocaleString("es-MX")} msnm
                              </span>
                            )}
                          </div>
                          <svg
                            className={cn(
                              "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 mt-1",
                              isOpen && "rotate-180"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </Accordion.Trigger>
                      </Accordion.Header>

                      <AccordionContent isOpen={isOpen}>
                        <p className="text-sm leading-relaxed text-slate-600 md:text-base mt-2">
                          {day.description}
                        </p>
                        {day.elevation && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-forest-50 px-3 py-2 border border-forest-200">
                            <Mountain className="h-4 w-4 text-forest-600" aria-hidden="true" />
                            <span className="text-sm font-medium text-forest-700">
                              Elevacion: {day.elevation.toLocaleString("es-MX")} msnm
                            </span>
                          </div>
                        )}
                      </AccordionContent>
                    </div>
                  </div>
                </Accordion.Item>
              );
            })}
          </div>
        </Accordion.Root>
      </div>
    </section>
  );
}
