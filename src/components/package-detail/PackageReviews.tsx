"use client";

import { useState } from "react";
import { Star, MessageSquareQuote, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Review {
  author: string;
  date: string;
  rating: number;
  text: string;
  expedition: string;
}

interface PackageReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100 text-forest-700">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{review.author}</p>
            <p className="text-xs text-slate-500">{formatDate(review.date)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{review.text}</p>
      <p className="mt-3 text-xs font-medium text-forest-600 bg-forest-50 rounded-full px-3 py-1 inline-block">
        {review.expedition}
      </p>
    </div>
  );
}

export default function PackageReviews({
  reviews,
  averageRating,
  totalCount,
}: PackageReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section aria-label="Resenas" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 md:text-3xl flex items-center gap-2">
              <MessageSquareQuote className="h-6 w-6 text-forest-700 md:h-7 md:w-7" aria-hidden="true" />
              Resenas
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(averageRating)} size="md" />
              <span className="text-lg font-bold text-slate-900">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-slate-500">
                ({totalCount} {totalCount === 1 ? "resena" : "resenas"})
              </span>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReviews.map((review) => (
            <ReviewCard key={`${review.author}-${review.date}`} review={review} />
          ))}
        </div>

        {/* Show more */}
        {reviews.length > 3 && !showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center rounded-lg border-2 border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Ver todas las resenas ({reviews.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
