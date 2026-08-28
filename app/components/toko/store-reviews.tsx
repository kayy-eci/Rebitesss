import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/app/components/SmartImage';
import { STORE, STORE_REVIEWS } from './data';
import type { StoreReview } from './types';

function StarRow({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            'h-3.5 w-3.5',
            index < Math.round(rating)
              ? 'fill-gold-500 text-gold-500'
              : 'fill-sage-100 text-sage-100'
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: StoreReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-sage-100">
          <SmartImage src={review.avatar} alt={`Foto ${review.author}`} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-charcoal-900">
            {review.author}
          </p>
          <p className="text-[11px] text-sage-500">{review.date}</p>
        </div>
        <StarRow rating={review.rating} className="ml-auto shrink-0" />
      </div>

      <span className="mt-3 w-fit rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-semibold text-charcoal-900">
        {review.menu}
      </span>
      <p className="mt-2.5 text-sm leading-relaxed text-charcoal-500">
        “{review.comment}”
      </p>
    </article>
  );
}

export function StoreReviews() {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Ulasan
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-medium tracking-tight text-primary sm:text-3xl">
            Kata Pembeli
          </h2>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-sage-100 bg-white px-4 py-3 shadow-sm">
          <p className="font-display text-3xl font-medium leading-none text-primary">
            {STORE.rating.toFixed(1)}
          </p>
          <div>
            <StarRow rating={STORE.rating} />
            <p className="mt-1 text-[11px] text-sage-500">
              dari {STORE.reviewCount} ulasan
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {STORE_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
