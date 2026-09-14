"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  videoUrl?: string;
}

interface MediaGalleryProps {
  items: GalleryItem[];
  maxVisible?: number;
}

export default function MediaGallery({
  items,
  maxVisible = 6,
}: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  const lightboxSlides = items
    .filter((item) => item.type === "image")
    .map((item) => ({
      src: item.src || "/placeholder.jpg",
      alt: item.alt,
      title: item.caption,
    }));

  function openLightbox(index: number) {
    // Map visible index to lightbox index (images only)
    const imageItems = items.filter((item) => item.type === "image");
    const targetItem = visibleItems[index];
    if (targetItem.type === "video") return;
    const lightboxIdx = imageItems.findIndex((img) => img.alt === targetItem.alt);
    setLightboxIndex(lightboxIdx >= 0 ? lightboxIdx : 0);
    setLightboxOpen(true);
  }

  return (
    <section aria-label="Galeria de fotos" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl flex items-center gap-2">
            <Camera className="h-6 w-6 text-forest-700 md:h-7 md:w-7" aria-hidden="true" />
            Galeria
          </h2>
          {remainingCount > 0 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm font-medium text-summit-600 hover:text-summit-700 transition-colors"
            >
              Ver todas las fotos ({items.length})
            </button>
          )}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[200px]">
          {visibleItems.map((item, index) => {
            const isFirst = index === 0;
            return (
              <button
                key={`${item.alt}-${index}`}
                onClick={() => openLightbox(index)}
                className={cn(
                  "relative overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 transition-transform hover:scale-[1.02]",
                  isFirst && "col-span-2 row-span-2"
                )}
                aria-label={`Ver ${item.type === "video" ? "video" : "imagen"}: ${item.alt}`}
              >
                {item.src ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={isFirst ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />
                )}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                      <Play className={cn("text-white", isFirst ? "h-10 w-10" : "h-6 w-6")} />
                    </div>
                  </div>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white/90 font-medium truncate">{item.caption}</p>
                  </div>
                )}
              </button>
            );
          })}

          {/* "See more" overlay on last visible item */}
          {!showAll && remainingCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="relative overflow-hidden rounded-lg bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2"
              aria-label={`Ver ${remainingCount} fotos mas`}
            >
              <div className="text-center">
                <Camera className="h-8 w-8 text-white/60 mx-auto mb-2" aria-hidden="true" />
                <span className="text-white font-medium text-sm">
                  +{remainingCount} mas
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </section>
  );
}
